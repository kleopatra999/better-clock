(function(exports) {
    "use strict";

    class BetterClock {
        /**
         * A clock that shows the progress of the day as a natural cycle
         * @param {object} args - Arguments object
         * @param {number} args.longitude - Longitude in degrees, e.g. `51.5` for London
         * @param {number} args.latitude - Latitude in degrees e.g. `-0.1` for London
         * @param {number} args.wakeupAt - Wakeup time in military format. Default `630`
         * @param {number} args.sleepAt - Sleep time in military format. Default `2230`
         */
        constructor(args) {
            let logger = this.logger = Logger;
            logger.useDefaults();
            logger.info("Arguments: ", args);
        
            let DEFAULT_ARGS = {
                longitude: 0,
                latitude: 0,
                wakeupAt: 630,
                sleepAt: 2230
            };
            
            _.defaults(args, DEFAULT_ARGS);
            this.args = args;

            if (this.args.longitude > 90 || this.args.longitude < -90) {
                throw new Error('Longitude exceeds limits [-90,90]');
            }

            if (this.args.latitude > 90 || this.args.latitude < -90) {
                throw new Error('Latitude exceeds limits [-90,90]');
            }

            if (this.args.wakeupAt > 2359 || this.args.wakeupAt < 0) {
                throw new Error('WakeupAt not in 24h time range [0 - 2359]');
            }

            if (this.args.wakeupAt.toString().slice(-2)*1 > 59) {
                throw new Error('WakeupAt contains too many minutes');
            }

            if (this.args.sleepAt > 2359 || this.args.sleepAt < 0) {
                throw new Error('SleepAt not in 24h time range [0 - 2359]');
            }

            if (this.args.sleepAt.toString().slice(-2)*1 > 59) {
                throw new Error('SleepAt contains too many minutes');
            }

            var dayhours = SunCalc.getTimes(new Date(), args.longitude, args.latitude);
            logger.debug(dayhours);
            
            var milestones = {
                dayStart: moment(dayhours.sunrise),
                    // Day
                dayEnd: moment(dayhours.sunset),
                    // Twilight
                night: moment(dayhours.night),
                    // Pitch black
                dawn: moment(dayhours.dawn),
                    // Twilight
                wakeupAt: args.wakeupAt,
                sleepAt: args.sleepAt
            }
            
            let secondScale = d3.scaleLinear()
                    .range([0,354])
                    .domain([0,59]);
            let minuteScale = secondScale;
        }
        

        render() {
            let logger = this.logger;
            logger.info("Drawing clock");
                
            let RADIANS = 0.0174532925, 
                CLOCKRADIUS = 200,
                MARGIN = 50,
                WIDTH = (CLOCKRADIUS+MARGIN)*2,
                HEIGHT = (CLOCKRADIUS+MARGIN)*2;

            var svg = d3.select("body").append("svg")
                    .attr("width", WIDTH)
                    .attr("height", HEIGHT);
            
            var donut = d3.layout.pie()
                    .sort(null)
                    .value(function(d){ return d.size})
                    
            
        };
    }

    exports.BetterClock = BetterClock;
})(this);