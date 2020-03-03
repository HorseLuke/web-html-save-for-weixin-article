import {checkUrlIsInHostList} from "../../../../../src/app/base/helper/UrlHelper.mjs";


describe('checkUrlIsInHostList', function() {

    it('checkUrlIsInHostList OK', function(done) {
        const res = checkUrlIsInHostList("http://www.aaa.com/asdgg/dasfg", ["www.aaa.com", "www.bbb.com"])
        done(res == 0 ? null : new Error(res));
    });


    it('checkUrlIsInHostList NOT IN WHITELIST', function(done) {
        const res = checkUrlIsInHostList("http://www.aaa.com/asdgg/dasfg", ["www.baaa.com"])
        done(res == -1 ? null : new Error(res));
    });

    it('checkUrlIsInHostList ERROR', function(done) {
        const res = checkUrlIsInHostList("hASDFSEGpASFwww.aaa.com/asdgg/dasfg", ["www.baaa.com"])
        done(res == -2 ? null : new Error(res));
    });

});

