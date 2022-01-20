import { Deserializeble } from "../interfaces/deserializable";

export class User implements Deserializeble{

    constructor(
        public Id: number,
        public CompleteName: string,
        public Description: string,
        public UserAccount: string,
        public UserPassword: string,
        public TeamId: number,
        public EntityId: number,
        public AccessLevel: string,
        public CreatedDate: Date,
        public ExpirationDate: Date,
        public Disabled: boolean
    ){}
    
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}


