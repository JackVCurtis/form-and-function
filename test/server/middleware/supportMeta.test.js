const supportMeta = require('../../../server/middleware/supportMeta')

const res = {
    jsonData: {},
    statusData: undefined,

    json: (d) => {
        res.jsonData = d
        return res
    },

    status: (n) => {
        res.statusData = n
        return res
    },

    clear: () => {
        res.json({})
        res.status(undefined)
    }
}

describe('Support Metadata middleware', () => {
    it('should provide metadata on a describe request', () => {
        res.clear()
        const middleware = supportMeta({validations: []})
        middleware({body: {meta_request: "describe"}, params: {}}, res)
        expect(res.jsonData.validations.length).toEqual(0)
    })

    it('should apply validations on a validate request', async () => {
        res.clear()
        const middleware = supportMeta({
            validations: [
                {
                    fields: ["email"], 
                    validators: ["exists", "isEmailFormat"],
                    messages: ["An email is required", "Please enter a valid email"]
                }
            ]
        })

        await middleware({
            body: {
                meta_request: "validate",
                fields: {email: "jack.v.curtis@gmail.com"}
            }, 
            params: {}
        }, res)

        expect(res.statusData).toEqual(200)
    })

    it('should throw an error on an invalid REST request', async () => {
        res.clear()
        const middleware = supportMeta({
            validations: [
                {
                    fields: ["email"], 
                    validators: ["exists", "isEmailFormat"],
                    messages: ["An email is required", "Please enter a valid email"]
                }
            ]
        })

        await middleware({
            body: {
                email: "invalidemail.com"
            }, 
            params: {}
        }, res)

        expect(res.statusData).toEqual(400)
    })

    it('should throw an error given an invalid meta_request type', async () => {
        res.clear()
        const middleware = supportMeta({
            validations: []
        })

        await middleware({
            body: {
                meta_request: "foobar"
            }, 
            params: {}
        }, res)

        expect(res.statusData).toEqual(400)
    })
})