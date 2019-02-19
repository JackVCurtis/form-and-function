function wait() {
    return new Promise(function(resolve, reject) {
        process.nextTick(resolve);
    });
}

const put = {
    '/api/login': async function(req) {
        await wait();
        if (req.email == 'jack.v.curtis@gmail.com' && req.password == 'asdf') {
            return {name: 'Jack', email: 'jack.v.curtis@gmail.com'};
        } else {
            throw new Error('Email not found or incorrect password');
        }
    }
}

const post = {
    '/api/accounts': async function(req) {
        await wait();
        return {name: req.name, email: req.email}
    }
}

const axios = {
    put: async function(endpoint, req) {
        console.log(put[endpoint]);
        const res = await put[endpoint](req);
        return res;
    },

    post: async function(endpoint, req) {
        return await post[endpoint](req);
    }
}

export default axios;