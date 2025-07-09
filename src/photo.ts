import {Rover} from "./rover";
import {Camera} from "./camera";

export interface Photo {
    id: number;
    sol: number;
    camera: Camera;
    img_src: string;
    earth_date: string;
    rover: Rover;
}
