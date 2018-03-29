class Timeline {
  constructor(linesMapper, years) {
    this.linesMapper = linesMapper;
    this.years = years;

    this.speed = 1;
    this.interval = null;
    this.playing = false;
  }

  toYear(year) {
    this.linesMapper.setYear(year);
    this.years.current = year;
  }

  animateToYear(year, startCallback, yearCallback, endCallback) {
    const difference = year - this.years.current;
    if (difference == 0) return;

    const sum = difference > 0 ? 1 : -1;
    let y = this.years.current;

    this.playing = true;

    if (typeof startCallback === 'function') startCallback();

    this.interval = setInterval(() => {
      y += sum;
      this.toYear(y);

      if (y == year || !this.playing) {
        clearInterval(this.interval);
        this.playing = false;
        if (typeof endCallback === 'function') endCallback();
        return;
      } else {
        if (typeof yearCallback == 'function') yearCallback(y);
      }
    }, this.speed);
  }

  stopAnimation(callback) {
    this.playing = false;
  }

  setSpeed(speed) {
    this.speed = speed;
  }
}

export default Timeline
