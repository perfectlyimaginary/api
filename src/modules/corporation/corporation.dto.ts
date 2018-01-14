import { DAllianceShort } from '../alliance/alliance.dto';
import { Corporation } from './corporation.entity';

export class DCorporationShort {
  id: number;
  name: string;
  ticker: string;
  description: string;
  alliance: DAllianceShort;

  constructor(corporation: Corporation) {
    this.id = corporation.id;
    this.name = corporation.name;
    this.ticker = corporation.ticker;
    this.description = corporation.description;
    this.alliance = new DAllianceShort(corporation.alliance);
  }
}

export class DCorporationShortWithoutAlliance {
  id: number;
  name: string;
  ticker: string;
  description: string;

  constructor(corporation: Corporation) {
    this.id = corporation.id;
    this.name = corporation.name;
    this.ticker = corporation.ticker;
    this.description = corporation.description;
  }
}

export class DCorporation {
  id: number;
  name: string;
  ticker: string;
  description: string;
  alliance: DAllianceShort;

  /* LIVE Data*/
  iskDestroyed: number;
  iskLost: number;
  pointsDestroyed: number;
  pointsLost: number;
  shipsDestroyed: number;
  shipsLost: number;
  soloKills: number;
  soloLosses: number;

  constructor(corporation: Corporation) {
    this.id = corporation.id;
    this.name = corporation.name;
    this.ticker = corporation.ticker;
    this.description = corporation.description;
    this.alliance = corporation.alliance ? new DAllianceShort(corporation.alliance) : null;

    this.iskDestroyed = corporation.iskDestroyed;
    this.iskLost = corporation.iskLost;
    this.pointsDestroyed = corporation.pointsDestroyed;
    this.pointsLost = corporation.pointsLost;
    this.shipsLost = corporation.shipsLost;
    this.shipsDestroyed = corporation.shipsDestroyed;
    this.soloKills = corporation.soloKills;
    this.soloLosses = corporation.soloLosses;
  }
}

export class DCorporationList {
  corporations: DCorporationShort[];

  constructor(corporations: Corporation[]) {
    this.corporations = corporations.map(corporation => new DCorporationShort(corporation));
  }
}
