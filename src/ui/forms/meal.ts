import { el, clamp, withCounter } from './_helpers';
import { copy } from '../copy';
import { extractMealProxies, type MealProxies } from '../../util/vision_proxy';

export interface FormHandle<T> {
  mount(container: HTMLElement): void;
  getContext(): T;
  validate(): { ok: true } | { ok: false; message: string };
  reset(): void;
}

const MEAL_TYPES = copy.mealTypes;

export function createMealForm(): FormHandle<any> {
  let root: HTMLElement;
  let mealTypeSel: HTMLSelectElement;
  let offeredInput: HTMLInputElement;
  let eatenInput: HTMLInputElement;
  let eatenLabel: HTMLElement;
  let stressGroup: HTMLElement;
  let stressBtns: HTMLButtonElement[] = [];
  let noiseCb: HTMLInputElement;
  let notesTa: HTMLTextAreaElement;
  let notesCounter: HTMLElement;
  let selectedStress: number | undefined = undefined;
  
  // New fields for enhanced meal form
  let photoInput: HTMLInputElement;
  let photoPreview: HTMLElement;
  let ratingSlider: HTMLInputElement;
  let ratingLabel: HTMLElement;
  let likedTagsInput: HTMLInputElement;
  let dislikedTagsInput: HTMLInputElement;
  let mealProxies: MealProxies | undefined;
  let thumbnail: string | undefined;

  function mount(container: HTMLElement) {
    container.innerHTML = '';
    root = el('div', { className: 'form form--meal' });

    // Meal type
    const labelType = el('label', { text: copy.forms.mealType, id: 'meal_type_label' });
    labelType.htmlFor = 'meal_type';
    mealTypeSel = el('select', { id: 'meal_type' });
    const defaultOption = document.createElement('option');
    defaultOption.text = copy.placeholders.selectMealType;
    defaultOption.value = '';
    mealTypeSel.appendChild(defaultOption);
    MEAL_TYPES.forEach(opt => {
      const o = document.createElement('option');
      o.text = opt.label;
      o.value = opt.value;
      mealTypeSel.appendChild(o);
    });
    root.appendChild(labelType);
    root.appendChild(mealTypeSel);

    // Offered
    const labelOffered = el('label', { text: copy.forms.offered, id: 'meal_offered_label' });
    labelOffered.htmlFor = 'meal_offered';
    offeredInput = el('input', { id: 'meal_offered' }) as HTMLInputElement;
    offeredInput.type = 'text';
    offeredInput.maxLength = 80;
    offeredInput.style.height = '40px';
    root.appendChild(labelOffered);
    root.appendChild(offeredInput);

    // Eaten pct
    const labelEaten = el('label', { text: copy.forms.eatenPercent, id: 'meal_eaten_label' });
    labelEaten.htmlFor = 'meal_eaten';
    eatenInput = el('input', { id: 'meal_eaten' }) as HTMLInputElement;
    eatenInput.type = 'range';
    eatenInput.min = '0';
    eatenInput.max = '100';
    eatenInput.step = '1';
    eatenInput.value = '0';
    eatenInput.style.width = '100%';
    eatenLabel = el('span', { id: 'meal_eaten_value', text: '0%' });
    eatenInput.addEventListener('input', () => {
      eatenLabel.textContent = eatenInput.value + '%';
    });
    root.appendChild(labelEaten);
    root.appendChild(eatenInput);
    root.appendChild(eatenLabel);

    // Stress level
    const labelStress = el('label', { text: copy.forms.stressLevel, id: 'meal_stress_label' });
    labelStress.htmlFor = 'meal_stress_group';
    stressGroup = el('div', { id: 'meal_stress_group' });
    stressBtns = [];
    for (let i = 0; i < 4; ++i) {
      const btn = el('button', { id: `meal_stress_${i}`, text: String(i) }) as HTMLButtonElement;
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.style.marginRight = '8px';
      btn.style.height = '40px';
      btn.addEventListener('click', () => {
        if (selectedStress === i) {
          selectedStress = undefined;
          btn.setAttribute('aria-pressed', 'false');
        } else {
          selectedStress = i;
          stressBtns.forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
        }
      });
      stressBtns.push(btn);
      stressGroup.appendChild(btn);
    }
    root.appendChild(labelStress);
    root.appendChild(stressGroup);

    // Environment noise
    const noiseLabel = el('label', { text: copy.forms.environmentNoise, id: 'meal_noise_label' });
    noiseLabel.htmlFor = 'meal_noise';
    noiseCb = el('input', { id: 'meal_noise' }) as HTMLInputElement;
    noiseCb.type = 'checkbox';
    noiseCb.style.height = '40px';
    root.appendChild(noiseLabel);
    root.appendChild(noiseCb);

    // Notes
    const notesLabel = el('label', { text: copy.forms.notes, id: 'meal_notes_label' });
    notesLabel.htmlFor = 'meal_notes';
    notesTa = el('textarea', { id: 'meal_notes' }) as HTMLTextAreaElement;
    notesTa.rows = 2;
    notesTa.maxLength = 200;
    notesTa.style.height = '60px';
    notesCounter = el('div', { className: 'notes-counter' });
    withCounter(notesTa, 200, notesCounter);
    root.appendChild(notesLabel);
    root.appendChild(notesTa);
    root.appendChild(notesCounter);

    // Photo capture
    const photoLabel = el('label', { text: '📷 Meal Photo (optional)', id: 'meal_photo_label' });
    photoLabel.htmlFor = 'meal_photo';
    photoInput = el('input', { id: 'meal_photo' }) as HTMLInputElement;
    photoInput.type = 'file';
    photoInput.accept = 'image/*';
    photoInput.capture = 'environment';
    photoInput.style.height = '40px';
    photoPreview = el('div', { id: 'meal_photo_preview' });
    photoPreview.style.cssText = `
      margin-top: 8px;
      padding: 8px;
      border: 1px dashed #ccc;
      border-radius: 4px;
      min-height: 40px;
      display: none;
    `;
    photoInput.addEventListener('change', handlePhotoChange);
    root.appendChild(photoLabel);
    root.appendChild(photoInput);
    root.appendChild(photoPreview);

    // Rating slider
    const ratingLabelEl = el('label', { text: '⭐ Rating (1-5 stars)', id: 'meal_rating_label' });
    ratingLabelEl.htmlFor = 'meal_rating';
    ratingSlider = el('input', { id: 'meal_rating' }) as HTMLInputElement;
    ratingSlider.type = 'range';
    ratingSlider.min = '1';
    ratingSlider.max = '5';
    ratingSlider.step = '1';
    ratingSlider.value = '3';
    ratingSlider.style.width = '100%';
    ratingLabel = el('span', { id: 'meal_rating_value', text: '3 ⭐⭐⭐' });
    ratingSlider.addEventListener('input', () => {
      const rating = parseInt(ratingSlider.value);
      ratingLabel.textContent = `${rating} ${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
    });
    root.appendChild(ratingLabelEl);
    root.appendChild(ratingSlider);
    root.appendChild(ratingLabel);

    // Liked tags
    const likedTagsLabel = el('label', { text: '👍 Liked foods (comma-separated)', id: 'meal_liked_tags_label' });
    likedTagsLabel.htmlFor = 'meal_liked_tags';
    likedTagsInput = el('input', { id: 'meal_liked_tags' }) as HTMLInputElement;
    likedTagsInput.type = 'text';
    likedTagsInput.maxLength = 100;
    likedTagsInput.placeholder = 'e.g., pasta, chicken, broccoli';
    likedTagsInput.style.height = '40px';
    root.appendChild(likedTagsLabel);
    root.appendChild(likedTagsInput);

    // Disliked tags
    const dislikedTagsLabel = el('label', { text: '👎 Disliked foods (comma-separated)', id: 'meal_disliked_tags_label' });
    dislikedTagsLabel.htmlFor = 'meal_disliked_tags';
    dislikedTagsInput = el('input', { id: 'meal_disliked_tags' }) as HTMLInputElement;
    dislikedTagsInput.type = 'text';
    dislikedTagsInput.maxLength = 100;
    dislikedTagsInput.placeholder = 'e.g., mushrooms, spicy food';
    dislikedTagsInput.style.height = '40px';
    root.appendChild(dislikedTagsLabel);
    root.appendChild(dislikedTagsInput);

    container.appendChild(root);
  }

  async function handlePhotoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) {
      mealProxies = undefined;
      thumbnail = undefined;
      photoPreview.style.display = 'none';
      return;
    }

    photoPreview.style.display = 'block';
    photoPreview.textContent = copy.placeholders.processing;

    try {
      // Extract derived proxies from image
      const result = await extractMealProxies(file, { allow_blur_thumbs: true });
      mealProxies = result.proxies;
      thumbnail = result.thumbnail;

      // Show preview with derived metrics
      photoPreview.innerHTML = `
        <div style="font-size: 12px; color: #666;">
          <strong>📸 Photo Analysis:</strong><br>
          • Color variance: ${(mealProxies.color_var * 100).toFixed(0)}%<br>
          • Estimated items: ${mealProxies.plate_items_est}<br>
          • Green presence: ${mealProxies.green_presence ? 'Yes' : 'No'}<br>
          • Clutter level: ${(mealProxies.clutter_est * 100).toFixed(0)}%
        </div>
      `;
    } catch (error) {
      console.error('Error processing photo:', error);
      photoPreview.textContent = 'Error processing photo. Please try again.';
      mealProxies = undefined;
      thumbnail = undefined;
    }
  }

  function getContext(): any {
    const ctx: any = {};
    
    // Basic meal info
    if (mealTypeSel.value) ctx.meal_type = mealTypeSel.value as any;
    const offered = offeredInput.value.trim();
    if (offered) ctx.offered = offered.slice(0, 80);
    
    // Eaten percentage
    const eaten = eatenInput.value.trim();
    if (eaten !== '') {
      const n = Number(eaten);
      if (!isNaN(n)) ctx.eaten_pct = clamp(n, 0, 100);
    }
    
    // Stress level
    if (selectedStress !== undefined) ctx.stress_level = selectedStress as 0|1|2|3;
    
    // Environment
    if (noiseCb.checked) ctx.environment_noise = true;
    
    // Rating
    const rating = parseInt(ratingSlider.value);
    if (rating >= 1 && rating <= 5) ctx.rating = rating;
    
    // Tags
    const likedTags = likedTagsInput.value.trim();
    if (likedTags) {
      ctx.liked_tags = likedTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    const dislikedTags = dislikedTagsInput.value.trim();
    if (dislikedTags) {
      ctx.disliked_tags = dislikedTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    // Notes (truncated to 200 chars as per spec)
    const notes = notesTa.value.trim();
    if (notes) ctx.notes = notes.slice(0, 200);
    
    // Photo-derived proxies
    if (mealProxies) {
      ctx.meal_proxies = mealProxies;
    }
    
    // Thumbnail (if available)
    if (thumbnail) {
      ctx.thumbnail = thumbnail;
    }
    
    return ctx;
  }

  function validate(): { ok: true } | { ok: false; message: string } {
    const eaten = eatenInput.value.trim();
    if (eaten !== '') {
      const n = Number(eaten);
      if (isNaN(n) || n < 0 || n > 100) return { ok: false, message: 'Eaten % must be 0–100' };
    }
    return { ok: true };
  }

  function reset() {
    mealTypeSel.value = '';
    offeredInput.value = '';
    eatenInput.value = '0';
    eatenLabel.textContent = '0%';
    selectedStress = undefined;
    stressBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    noiseCb.checked = false;
    notesTa.value = '';
    notesCounter.textContent = '0/200';
    
    // Reset new fields
    photoInput.value = '';
    photoPreview.style.display = 'none';
    photoPreview.textContent = '';
    ratingSlider.value = '3';
    ratingLabel.textContent = '3 ⭐⭐⭐';
    likedTagsInput.value = '';
    dislikedTagsInput.value = '';
    mealProxies = undefined;
    thumbnail = undefined;
  }

  return { mount, getContext, validate, reset };
}