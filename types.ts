import { ObjectId } from "mongodb";

export type vuelosDb={
    _id?:ObjectId,
    Origen:string,
    Destino:string,
    FechaH:string
}

export type vuelos={
    _id?:string,
    Origen:string,
    Destino:string,
    FechaH:string
}