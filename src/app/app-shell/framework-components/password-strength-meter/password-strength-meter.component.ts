import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { translations } from '@zxcvbn-ts/language-en';

zxcvbnOptions.setOptions({ translations });

@Component({
  selector: 'password-strength-meter',
  template: `
    <div class="meter" role="progressbar" aria-label="Password strength"
      aria-valuemin="0" aria-valuemax="4" [attr.aria-valuenow]="score">
      @for (segment of segments; track segment) {
        <span class="segment" [style.background-color]="segment <= filledSegments ? color : null"></span>
      }
    </div>
  `,
  styles: [`
    .meter { display: flex; gap: 4px; height: 3px; margin: 10px auto; }
    .segment { flex: 1; border-radius: 3px; background: #ddd; transition: background-color .25s; }
  `]
})
export class PasswordStrengthMeterComponent implements OnChanges {
  @Input() password: string | null = null;
  @Input() minPasswordLength = 8;
  @Input() numberOfProgressBarItems = 5;
  @Output() strengthChange = new EventEmitter<number | null>();

  score: number | null = null;
  segments: number[] = [];
  filledSegments = 0;
  color = '#dc3545';

  ngOnChanges(): void {
    const count = Math.max(1, Math.floor(this.numberOfProgressBarItems));
    this.segments = Array.from({ length: count }, (_, index) => index + 1);

    const nextScore = !this.password
      ? null
      : this.password.length < this.minPasswordLength
        ? 0
        : zxcvbn(this.password).score;

    this.filledSegments = nextScore === null ? 0 : Math.ceil(((nextScore + 1) / 5) * count);
    this.color = nextScore === null || nextScore < 2 ? '#dc3545'
      : nextScore < 4 ? '#ffc107' : '#198754';

    if (this.score !== nextScore) {
      this.score = nextScore;
      this.strengthChange.emit(nextScore);
    }
  }
}
