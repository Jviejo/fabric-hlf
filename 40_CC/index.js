const { Contract } = require('fabric-contract-api');
class MyFirstSmartContract extends Contract {
    async Ping(ctx) {
        return 'Pong';
    }
    async PingWithArg(ctx, arg) {
        return arg;
    }
    async Store(ctx, key, value) { 
        await ctx.stub.putState(key, Buffer.from(value));
    }
    async Get(ctx, key) {
        const value = await ctx.stub.getState(key);
        return value.toString();
    }   
}
class MySecondSmartContract extends Contract {
    async Ping(ctx) {
        return 'Pong MySecondSmartContract updated  ';
    }
    async PingWithArg(ctx, arg) {
        return arg + ' MySecondSmartContract';
    }
    async Store(ctx, key, value) {
        await ctx.stub.putState(key, Buffer.from(value));
    }
    async Get(ctx, key) {
        const value = await ctx.stub.getState(key);
        return value.toString();
    }   
}



module.exports.contracts = [MyFirstSmartContract, MySecondSmartContract];

