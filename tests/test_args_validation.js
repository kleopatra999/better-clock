var expect = chai.expect;

describe('Validate arguments', function() {
    var sandbox;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        sandbox.stub(Logger, "useDefaults");
        sandbox.stub(Logger, "debug");
        sandbox.stub(Logger, "info");
    });

    afterEach(function(){
        sandbox.restore();
    });

    it('sets defaults if arguments are provided as "null"', function() {
        var timeMachine = sinon.useFakeTimers(new Date(2015,10,21).getTime());

        let inputs = {
            longitude: null,
            latitude: null,
            wakeupAt: null,
            sleepAt: null,
            date: null,
            openWeatherAPIToken: null
        };

        let expected = {
            date: "2015-10-21",
            longitude: 0,
            latitude: 0,
            wakeupAt: 630,
            sleepAt: 2230,
            openWeatherAPIToken: null
        }
        let clock = new BetterClock(inputs);
        expect(clock.args).to.have.property('longitude', 0);
        expect(clock.args).to.have.property('latitude', 0);
        expect(clock.args).to.have.property('wakeupAt', 630);
        expect(clock.args).to.have.property('sleepAt', 2230);
        expect(clock.args).to.have.property('original_date', (new Date()).toISOString().slice(0,10));
        expect(clock.args).to.have.property('openWeatherAPIToken', null);
        expect(clock.args.date).to.deep.equal(moment((new Date()).toISOString().slice(0,10)));
        timeMachine.restore();
    });

    it('throws error if longitude is not within -90 <-> +90', function() {
        expect(() => new BetterClock({ longitude: 91 })).to.throw('Longitude exceeds limits [-90,90]');
        expect(() => new BetterClock({ longitude: -91 })).to.throw('Longitude exceeds limits [-90,90]');
    });

    it('throws error if latitude is not within -90 <-> +90', function() {
        expect(() => new BetterClock({ latitude: 91 })).to.throw('Latitude exceeds limits [-90,90]');
        expect(() => new BetterClock({ latitude: -91 })).to.throw('Latitude exceeds limits [-90,90]');
    });

    it('throws error if wakeupAt is not within 0 <-> 2359', function() {
        expect(() => new BetterClock({ wakeupAt: -1 })).to.throw('WakeupAt not in 24h time range [0 - 2359]');
        expect(() => new BetterClock({ wakeupAt: 2360 })).to.throw('WakeupAt not in 24h time range [0 - 2359]');
    });

    it('throws error if wakeupAt time minutes exceed 59 (there is no such time as 01:60)', function() {
        expect(() => new BetterClock({ wakeupAt: 160 })).to.throw('WakeupAt contains too many minutes');
        expect(() => new BetterClock({ wakeupAt: 2275 })).to.throw('WakeupAt contains too many minutes');
    });

    it('throws error if sleepAt is not within 0 <-> 2359', function() {
        expect(() => new BetterClock({ sleepAt: -1 })).to.throw('SleepAt not in 24h time range [0 - 2359]');
        expect(() => new BetterClock({ sleepAt: 2360 })).to.throw('SleepAt not in 24h time range [0 - 2359]');
    });

    it('throws error if sleepAt time minutes exceed 59 (there is no such time as 01:60)', function() {
        expect(() => new BetterClock({ sleepAt: 160 })).to.throw('SleepAt contains too many minutes');
        expect(() => new BetterClock({ sleepAt: 2275 })).to.throw('SleepAt contains too many minutes');
    });

    it('throws error if date is invalid', function() {
        expect(() => new BetterClock({ date: '!@#%AS'.to.throw('date is invalid')}));
        expect(() => new BetterClock({ date: '13211-01-01'.to.throw('date is invalid')}));
    });
});