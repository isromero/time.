import {
  Pipe,
  PipeTransform,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  inject,
} from '@angular/core';

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

@Pipe({
  name: 'relativeTime',
  pure: false,
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform, OnDestroy {
  private timer: number | null = null;
  private lastValue: number | null = null;
  private lastString: string | null = null;
  private rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  private changeDetectorRef = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  transform(value: FirestoreTimestamp | Date | string | null): string {
    if (value === null || value === undefined) {
      this.removeTimer();
      return '';
    }

    const timestamp = this.getTimestamp(value);
    if (timestamp === null) {
      return 'Invalid date';
    }

    if (timestamp !== this.lastValue) {
      this.lastValue = timestamp;
      if (!this.timer) {
        this.createTimer();
      }
    }

    const result = this.getRelativeTimeString(timestamp);

    if (result !== this.lastString) {
      this.lastString = result;
      this.changeDetectorRef.markForCheck();
    }

    return result;
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  private getTimestamp(
    value: FirestoreTimestamp | Date | string
  ): number | null {
    if (this.isFirestoreTimestamp(value)) {
      return value.seconds * 1000 + value.nanoseconds / 1000000;
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      return isNaN(parsedDate.getTime()) ? null : parsedDate.getTime();
    }
    return null;
  }

  private isFirestoreTimestamp(value: any): value is FirestoreTimestamp {
    return (
      typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value
    );
  }

  private getRelativeTimeString(timestamp: number): string {
    try {
      const now = Date.now();
      const diffInSeconds = (now - timestamp) / 1000;

      if (!isFinite(diffInSeconds)) {
        throw new Error('Invalid time difference');
      }

      const abs = Math.abs(diffInSeconds);

      if (abs < 60)
        return this.rtf.format(-Math.round(diffInSeconds), 'second');
      if (abs < 3600)
        return this.rtf.format(-Math.round(diffInSeconds / 60), 'minute');
      if (abs < 86400)
        return this.rtf.format(-Math.round(diffInSeconds / 3600), 'hour');
      if (abs < 604800)
        return this.rtf.format(-Math.round(diffInSeconds / 86400), 'day');
      if (abs < 2592000)
        return this.rtf.format(-Math.round(diffInSeconds / 604800), 'week');
      if (abs < 31536000)
        return this.rtf.format(-Math.round(diffInSeconds / 2592000), 'month');
      return this.rtf.format(-Math.round(diffInSeconds / 31536000), 'year');
    } catch (error) {
      console.error('Error calculating relative time:', error);
      return 'Unknown time';
    }
  }

  private createTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      this.timer = window.setInterval(() => {
        this.ngZone.run(() => {
          if (this.lastValue) {
            const newString = this.getRelativeTimeString(this.lastValue);
            if (newString !== this.lastString) {
              this.lastString = newString;
              this.changeDetectorRef.markForCheck();
            }
          }
        });
      }, 10000);
    });
  }

  private removeTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
