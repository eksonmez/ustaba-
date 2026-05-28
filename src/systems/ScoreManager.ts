export class ScoreManager {
  private score: number = 0;

  add(points: number) {
    this.score += points;
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = 0;
  }
}
