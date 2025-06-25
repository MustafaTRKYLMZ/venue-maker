import { Door } from "./door";
import { Floor } from "./floor";
import { Light } from "./light";
import { Stage } from "./stage";

export type Venue = {
  id: string;
  name: string;
  floors: Floor[];
  stage?: Stage;
  doors?: Door[];
  lights?: Light[];
  createdAt: string;
  updatedAt: string;
  address?: string;
  description?: string;
  image?: string;
  capacity?: number;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
};
