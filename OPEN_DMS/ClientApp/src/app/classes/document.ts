import { Deserializeble } from "../interfaces/deserializable";

export class DocumentFile implements Deserializeble{

    constructor(
        public Id: number,
        public FileName: string,
        public Extension: string,
        public Size: string,
        public TeamId: number,
        public EntityId: number,
        public InsertionDate: Date,
        public PathAlternative: string,
        public CommentDetail: string,
        public DistinctDetail: string,
        public IdUser: number,
        public Disabled: boolean
    ){}
    
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}


export class DocumentFileIcon implements DocumentFile{
    constructor(
        public Id: number,
        public FileName: string,
        public Extension: string,
        public Size: string,
        public TeamId: number,
        public EntityId: number,
        public InsertionDate: Date,
        public PathAlternative: string,
        public CommentDetail: string,
        public DistinctDetail: string,
        public IdUser: number,
        public icon: string,
        public Disabled: boolean
    ){}
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}