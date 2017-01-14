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

  animateToYear(year, yearCallback, endCallback) {
    const difference = year - this.years.current;
    if (difference == 0) return;

    const sum = difference > 0 ? 1 : -1;
    let y = this.years.current;

    this.playing = true;

    this.interval = setInterval(() => {
      if (y == year) {
        this.stopAnimation();
        if (typeof endCallback === 'function') endCallback();
        return;
      }
      y += sum;
      this.toYear(y);
      if (typeof yearCallback == 'function') yearCallback(y);
    }, this.speed);
  }

  stopAnimation(callback) {
    clearInterval(this.interval);
    this.playing = false;
    if (typeof callback === 'function') callback(this.years.current);
  }
}

export default Timeline
