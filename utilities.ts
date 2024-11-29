import { vuelos, vuelosDb } from "./types.ts";

export let frommdoletoflight=(model:vuelosDb):vuelos=>{
    return{
        _id:model._id!.toString(),
        Origen:model.Origen,
        Destino:model.Destino,
        FechaH:model.FechaH
    }
}