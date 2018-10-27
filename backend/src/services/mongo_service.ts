import * as mongoose from "mongoose";
import { MONGO_CONNECTION_STRING } from "../config/constants";
import { MongoServiceT } from "../types/services/mongo_service";
import { UserModel } from "../models/UserModel";
import { ClientModel } from "../models/ClientModel";

export const MongoService = (() => {

    const registerUser = (name: string, password: string): Promise<any> => {
        return UserModel.updateOne({name: name},
            {name: name, password: password},
            {upsert: true})
            .exec();
    };

    const getUserByName = (name: string): Promise<any> => {
        return UserModel.findOne({name: name}).exec();
    };

    const updateClientFromEmail = (name: string, totalJobs: number, totalPages: number): Promise<any> => {
        return ClientModel.updateOne({name: name}, {
            "$inc": {
                totalJobs: totalJobs,
                totalPages: totalPages,
                duePages: totalPages,
            }
        }).exec();
    };

    const markPaymentForClient = (name: string): Promise<any> => {
        return ClientModel.updateOne({name: name}, {
            duePages: 0,
        }).exec();
    };

    const mongo: MongoServiceT = {
        registerUser,
        getUserByName,
        updateClientFromEmail,
        markPaymentForClient,
    };

    const init = () => {
        return mongoose.connect(MONGO_CONNECTION_STRING, {useNewUrlParser: true}).then(() => {
            console.log("Database connection established");
            return mongo;
        });
    };

    return {
        init,
    }
})();
