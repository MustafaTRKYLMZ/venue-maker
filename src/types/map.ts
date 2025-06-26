import { Seat } from "./seat";
import { Door } from "./door";
import { Stage } from "./stage";

import { Section } from "./section";
import { Floor } from "./floor";
import { Venue } from "./venue";

import { MapElement } from "./mapElement";
import { Light } from "./light";
import { Wall } from "./wall";
import { Row } from "./row";

export type Map =
  | Seat
  | Door
  | Stage
  | Text
  | Wall
  | Section
  | Floor
  | Venue
  | Row
  | MapElement
  | (Light & MapElement);
