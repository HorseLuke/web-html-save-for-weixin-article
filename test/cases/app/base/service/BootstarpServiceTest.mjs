import BootstarpService from "../../../../../src/app/base/service/BootstarpService.mjs";


describe('BootstarpService Test', function() {

    it('checkCtype OK', function(done) {

        const passTestList = [
            {ctype: "cli", expected: true},
            {ctype: "C", expected: true},
            {ctype: "cli_", expected: false},
            {ctype: "cli\\_", expected: false},
        ];

        for(let i in passTestList){
            let passTestCase = passTestList[i];
            if(BootstarpService.instance.checkCtype(passTestCase.ctype) !== passTestCase.expected){
                done(new Error("TEST FAIL!" + passTestCase.ctype + " IS NOT " + passTestCase.expected));
                return ;
            }
        }

        done();
    });


    it('parseRouter ok', function(done) {

        const passTestList = [
            {router: "d/e/f", expected: 0},
            {router: "index/index/index", expected: 0},
            {router: "index/index0/index", expected: 0},
            {router: "index/index/i_ndex", expected: 0},
            {router: "index/i\_ndex/index", expected: 0},
            {router: "index/ind\\ex/index", expected: -1},
            {router: "index/ind/ex/index", expected: -1},
            {router: "0index/index/index", expected: -1},
            {router: "index/0index/index", expected: -1},
            {router: "index/index/0index", expected: -1},
            {router: "index/ind-ex/index", expected: -1},
            {router: "index/in.dex/index", expected: -1},

        ];

        for(let i in passTestList){
            let passTestCase = passTestList[i];
            let resultCase = BootstarpService.instance.parseRouter(passTestCase.router);
            if(resultCase.error !== passTestCase.expected){
                done(new Error("TEST FAIL!" + passTestCase.router + " IS NOT " + passTestCase.expected));
                return ;
            }
        }

        done();

    });

    

});

