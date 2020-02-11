/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = [
            {
                firstName: 'Gaurav',
                lastName: 'Bansode',
                emailAddress: 'gauravbansode@gmail.com',
                dob: '22/11/1998',
                address: 'katraj',
                healthStatus: 'healthy',
            },
            {
                firstName: 'Shatabdi',
                lastName: 'Bhise',
                emailAddress: 'shatabdibhise@gmail.com',
                dob: '11/12/1998',
                address: 'viman nagar',
                healthStatus: 'unhealthy',
            },
            {
                firstName: 'Aditya',
                lastName: 'Borikar',
                emailAddress: 'adityaborikar@gmail.com',
                dob: '01/04/1998',
                address: 'Aundh',
                healthStatus: 'healthy',
            },
            {
                firstName: 'Aditya',
                lastName: 'Padwal',
                emailAddress: 'adityapadwal@gmail.com',
                dob: '12/12/1997',
                address: 'hinjewadi',
                healthStatus: 'unhealthy',
            },
           
        ];

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('USER' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // async queryPatient(ctx, userId) {
    //     const userAsBytes = await ctx.stub.getState(userId); // get the car from chaincode state
    //     if (!userAsBytes || userAsBytes.length === 0) {
    //         throw new Error(`${userId} does not exist`);
    //     }
    //     console.log(userAsBytes.toString());
    //     return userAsBytes.toString();
    // }

    async createPatient(ctx, userId, firstName, lastName, emailAddress, dob,address,healthStatus) {
        console.info('============= START : Create Patient EHR ===========');

        const patient = {
            firstName,
            docType: 'user',
            lastName,
            emailAddress,
            dob,
            address,
            healthStatus,
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(patient)));
        console.info('============= END : Create Patient EHR ===========');
    }

    async queryAllPatients(ctx) {
        const startKey = 'USER0';
        const endKey = 'USER999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    // async changeHealthStatus(ctx, carNumber, newOwner) {
    //     console.info('============= START : changeHealthStatus ===========');

    //     const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
    //     if (!carAsBytes || carAsBytes.length === 0) {
    //         throw new Error(`${carNumber} does not exist`);
    //     }
    //     const car = JSON.parse(carAsBytes.toString());
    //     car.owner = newOwner;

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : changeHealthStatus ===========');
    // }

}

module.exports = FabCar;
