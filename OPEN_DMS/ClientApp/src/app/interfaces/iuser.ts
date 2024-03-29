export interface IUser {
    Id?: number
    CompleteName?: string
    Description?: string
    UserAccount?: string
    UserPassword?: string
    TeamId?: number,
    Entityd?: number,
    AccessLevel?: string
    CreatedDate?: Date
    ExpirationDate?: Date
    Disabled?: boolean
}