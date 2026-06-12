class Segment {
  constructor(id, station1, station2, line = null) {
    this.id = id;
    this.station1 = station1;
    this.station2 = station2;
    this.line = line;
  }

  containsStation(stationId) {
    return this.station1.id === stationId || this.station2.id === stationId;
  }

  getStation(stationId) {
    if (this.station1.id === stationId) {
      return this.station1;
    }

    if (this.station2.id === stationId) {
      return this.station2;
    }

    return null;
  }

  getOtherStationId(stationId) {
    if (this.station1.id === stationId) {
      return this.station2.id;
    }

    if (this.station2.id === stationId) {
      return this.station1.id;
    }

    return null;
  }
}

class Game {
  constructor(
    id,
    userId,
    startStation,
    destinationStation,
    startedAt,
    completedAt,
    validRoute,
    finalCoins
  ) {
    this.id = id;
    this.userId = userId;
    this.startStation = startStation;
    this.destinationStation = destinationStation;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.validRoute = validRoute;
    this.finalCoins = finalCoins;
  }

  belongsTo(userId) {
    return this.userId === userId;
  }

  isCompleted() {
    return this.completedAt !== null;
  }

  isExpired(timeLimitSeconds) {
    const elapsedMilliseconds = Date.now() - new Date(this.startedAt).getTime();
    return elapsedMilliseconds > timeLimitSeconds * 1000;
  }
}

export {Segment, Game}