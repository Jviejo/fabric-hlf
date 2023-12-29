const { Contract} = require('fabric-contract-api');

class SmartContract1 extends Contract {
    async Ping(ctx) {
        return "Pong SmartContract1";
    }
}
class SmartContract2 extends Contract {
    async Ping(ctx) {
        return "Pong SmartContract2 modificado";
    }
    async Ping2(ctx) {
        return "Pong SmartContract2 modificado 2";
    }
    async Ping3(ctx) {
        return "Pong SmartContract2";
    }
    async Store(ctx, key, value) {
        await ctx.stub.putState(key, Buffer.from(value));
    }
    async Get(ctx, key) {
        const value = await ctx.stub.getState(key);
        return value.toString();
    }
}
module.exports.contracts = [SmartContract1, SmartContract2];
