import { Gender } from './randomCzechName';


export interface IRandomCzechNameOptions {
  pickGender?: Gender;
  isProportionallyRandom: boolean;
  hasFirstName: boolean;
  hasLastName: boolean;
}
