import { Deserializeble } from "../interfaces/deserializable";

export class Entity implements Deserializeble{

    constructor(
        public Id: number,
        public EntityName: string,
        public Disabled: boolean
    ){}
    
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}