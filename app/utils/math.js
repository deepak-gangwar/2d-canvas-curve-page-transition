export function lerp (start, end, amt) {
    return start + (end - start) * amt
    // return start * (1 - amt) + end * amt
  }

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

export function easeInOut (t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function interpolate (start, end, value) {
  return (start * (1.0 - value)) + (end * value)
}

export function clamp (min, max, number) {
  return Math.max(min, Math.min(number, max))
}

export function random (min, max) {
  return Math.random() * (max - min) + min
}