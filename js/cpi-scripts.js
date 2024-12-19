function validateEmail(string) {
    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(string)) {
        return true;
    }
    return false;
}

function validateAmount(curr_amount, input_amount) {
    if (parseFloat(input_amount) > parseFloat(curr_amount)) { // requires at least 0.00000000000001 higher amount

        return true;
    }
    return false;

}

//Pie chart function
function drawPieChart(stats, color_array, chart_height, chart_width) {
    google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data = google.visualization.arrayToDataTable(stats);

            var options = {
                legend: 'none',
                backgroundColor: 'none',
                height: chart_height,
                width: chart_width,
                chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
                enableInteractivity: false,
                colors: color_array,
                pieSliceTextStyle: { fontName: 'Rubik', fontSize: 20 }

            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);
        }
    }


// Call the function after the window loads
window.onload = () => {
    drawPieChart([
        ['Category', 'Percentage'],
        ['Access to Education', 25],
        ['Nutritious Meals', 23],
        ['Clean Water', 21],
        ['Safe Shelter', 21],
        ['Health and Care', 10]], 
        ['#537FF1', '#8979FF', '#FF928A', '#3CC3DF', '#FFAE4C'],
        264, 264);
};




const urlParams = new URLSearchParams(window.location.search);

const DELIMITER = String.fromCharCode(30); // Record Separator


document.addEventListener('alpine:init', () => {
    Alpine.data('form', () => ({
        amount: 75,
        current_amount: 0,
        choice: '',
        total: 0,
        rate: '1.05',

        amountDefaults: {
            'Monthly': 40,
            'One-off': 100
        },
        amountOptions: {
            'Monthly': ['20', '50', '75', '100', 'other'],
            'One-off': ['20', '50', '75', '100', 'other']
        },

        frequency: 'Monthly',
        name_first: '',
        name_last: '',
        phone: '',
        email: '',

        company: '',

        payment_by: 'Individual',

        mailing_street: '',
        mailing_city: '',
        mailing_state: '',
        mailing_postal_code: '',
        mailing_country: 'AU',

        _errors: {},

        _loaded: false,
        _max: 1,
        _submit: false,
        _stage: 1,

        init() {
            // get decoded params from URL
            const encodedData = urlParams.get('data');
            if (encodedData) {
                this.decodeAndPopulateForm(encodedData);
            }

            //Set current donation amount
            this.current_amount = parseFloat(urlParams.get('amount') || this.amount);
            let current_amount_str = "Your Current Donation: $" + this.current_amount;
            document.getElementById("current_amount").innerHTML = current_amount_str;
            this.amount = Math.round(this.current_amount * parseFloat(this.rate) * 100) / 100; // define amount
            this.total = this.amount; // define total


            document.getElementById("stg1complete").style.display="none";
            document.getElementById("stg1future").style.display="none";
            document.getElementById("stg2current").style.display="none";
            document.getElementById("stg2complete").style.display="none";
            document.getElementById("stg3current").style.display="none";
            document.getElementById("stg3complete").style.display="none";


            // this.$watch('frequency', (frequency) => {
            //     // includes the amount in that frequency
            //     if (!this.amountOptions[frequency].includes(this.amount)) {
            //         this.$nextTick(() => {
            //             this.amount = this.amountDefaults[frequency]
            //         })
            //     }
            // });

            this.$watch('amount', (amount) => {
                this.total = amount;
                this._errors.amount = false;
                if (amount == 'other') {
                    this.$refs['choice'].focus();
                } else {
                    this.choice = '';
                }
            });
            this.$watch('choice', (amount) => {
                this._errors.choice = false;
                this.total = amount;
            });
            this.$watch('name_first', (value) => {
                this._errors.name_first = !value;
            });
            this.$watch('name_last', (value) => {
                this._errors.name_last = !value;
            });
            this.$watch('phone', (value) => {
                this._errors.phone = false;
                if (this.isMonthly) {
                    this._errors.phone = !value;
                }
            });
            this.$watch('email', (value) => {
                this._errors.email = !value;
            });

            this.$watch('mailing_street', (value) => {
                this._errors.mailing_street = false;
                if (this.isMonthly) {
                    this._errors.mailing_street = !value;
                }
            });
            this.$watch('mailing_city', (value) => {
                this._errors.mailing_city = false;
                if (this.isMonthly) {
                    this._errors.mailing_city = !value;
                }
            });
            this.$watch('mailing_state', (value) => {
                this._errors.mailing_state = false;
                if (this.isMonthly) {
                    this._errors.mailing_state = !value;
                }
            });
            this.$watch('mailing_postal_code', (value) => {
                this._errors.mailing_postal_code = false;
                if (this.isMonthly) {
                    this._errors.mailing_postal_code = !value;
                }
            });
            this.$watch('rate', (value) => {
                const baseAmount = this.current_amount;
                this.amount = Math.round(baseAmount * parseFloat(value) *100) / 100;
                this.total = this.amount;
            });

            window.onpopstate = (event) => {
                if (this._submit) {
                    // form was submitted
                    history.go(-2);
                }
            };

        },

        // fill form with decoded data
        async decodeAndPopulateForm(encodedData) {
            try {
                const decodedValue = await this.decodeData(encodedData);
                const fields = decodedValue.split(DELIMITER);

                if (fields.length >= 4) {
                    this.name_first = fields[0];
                    this.name_last = fields[1];
                    this.email = fields[2];
                    this.phone = fields[3];
                }
            } catch (error) {
                console.error('Error decoding URL data:', error);
            }
        },

        async decodeData(encodedValue) {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

            // Extract length information
            const originalLength = alphabet.indexOf(encodedValue[0]) * 32 +
                alphabet.indexOf(encodedValue[1]);

            // Convert to bits (skip first two length chars)
            let bits = '';
            for (const char of encodedValue.slice(2)) {
                const index = alphabet.indexOf(char);
                if (index === -1) continue;
                bits += index.toString(2).padStart(5, '0');
            }

            // Trim bits to original length
            bits = bits.slice(0, originalLength);

            // Convert bits to characters
            let decoded = '';
            for (let i = 0; i < bits.length; i += 8) {
                const byte = bits.slice(i, i + 8);
                if (byte.length < 8) break;
                decoded += String.fromCharCode(parseInt(byte, 2));
            }

            return decoded;
        },

        changeForRate(rate) {
            const rateMap = {
                '1.028': 'images/8aff547d8f1d5a2c539af7cf4d5b87d3.jpeg',
                '1.035': 'images/abd18fa7e78683fab9f1e92226c1d533.jpeg', 
                '1.05': 'images/5b8e5c05f680809f643bcca0725e7618.jpeg'
            };

            if (rate == 1.028) {
                document.getElementById("amount-desc").innerHTML = "- Offers emergency relief to a disaster-stricken community, providing food, shelter, and medical aid."
            }
            else if (rate == 1.035) {
                document.getElementById("amount-desc").innerHTML = "- Supplies clean drinking water to a family for a year, preventing waterborne illnesses."
            }
            else if (rate == 1.05) {
                document.getElementById("amount-desc").innerHTML = "- Provides vital vaccines for several children, protecting them from deadly diseases in impoverished areas."
            }
            return rateMap[rate] || 'images/5b8e5c05f680809f643bcca0725e7618.jpeg';
        },

        get isMonthly() {
            return this.frequency === 'Monthly';
        },

        goTo(stage) {
            // only allow to switch if we have visited it once
            if (stage <= this._max) {
                this.switchStage(stage);
            }
        },

        progress() {
            this.switchStage(this._stage + 1);

        },

        switchStage(nextStage) {
            // already on the same stage
            if (this._stage == nextStage) {
                return;
            }

            //Change progress bar images
            if (nextStage == 1) {
                document.getElementById("stg1current").style.display="block";
                document.getElementById("stg1complete").style.display="none";
                document.getElementById("stg1future").style.display="none";
                document.getElementById("stg2current").style.display="none";
                document.getElementById("stg2complete").style.display="none";
                document.getElementById("stg2future").style.display="block";
                document.getElementById("stg3current").style.display="none";
                document.getElementById("stg3complete").style.display="none";
                document.getElementById("stg3future").style.display="block";
            }
            if (nextStage == 2 && this._max > 2) {
                document.getElementById("stg1current").style.display="none";
                document.getElementById("stg1complete").style.display="block";
                document.getElementById("stg1future").style.display="none";
                document.getElementById("stg2current").style.display="block";
                document.getElementById("stg2complete").style.display="none";
                document.getElementById("stg2future").style.display="none";
                document.getElementById("stg3current").style.display="none";
                document.getElementById("stg3complete").style.display="none";
                document.getElementById("stg3future").style.display="block";
            }
            if (nextStage == 3 && this._max > 2) {
                document.getElementById("stg1current").style.display="none";
                document.getElementById("stg1complete").style.display="block";
                document.getElementById("stg1future").style.display="none";
                document.getElementById("stg2current").style.display="none";
                document.getElementById("stg2complete").style.display="block";
                document.getElementById("stg2future").style.display="none";
                document.getElementById("stg3current").style.display="block";
                document.getElementById("stg3complete").style.display="none";
                document.getElementById("stg3future").style.display="none";
                }



            // reset errors
            this._errors = {};


            //validate stage 1
            if (this._stage == 1 && nextStage > this._stage) {
                if (!this.total || !validateAmount(this.current_amount, this.total)) {
                    this._errors.amount = true;
                }


                if (Object.keys(this._errors).length) {
                    return;
                }
                else if (nextStage == 2) {
                    document.getElementById("stg1current").style.display="none";
                    document.getElementById("stg1complete").style.display="block";
                    document.getElementById("stg1future").style.display="none";
                    document.getElementById("stg2current").style.display="block";
                    document.getElementById("stg2complete").style.display="none";
                    document.getElementById("stg2future").style.display="none";
                    document.getElementById("stg3current").style.display="none";
                    document.getElementById("stg3complete").style.display="none";
                    document.getElementById("stg3future").style.display="block";
                }
            }



            // validate stage 2
            if (this._stage == 2 && nextStage > this._stage) {
                // validate
                if (!this.name_first) {
                    this._errors.name_first = true;
                }

                if (!this.name_last) {
                    this._errors.name_last = true;
                }

                if (!this.email || !validateEmail(this.email)) {
                    this._errors.email = true;
                }
                if (this.isMonthly) {
                    if (!this.phone) {
                        this._errors.phone = true;
                    }
                }

                if (Object.keys(this._errors).length) {
                    return;
                }
                else if (nextStage == 3) {
                    document.getElementById("stg1current").style.display="none";
                    document.getElementById("stg1complete").style.display="block";
                    document.getElementById("stg1future").style.display="none";
                    document.getElementById("stg2current").style.display="none";
                    document.getElementById("stg2complete").style.display="block";
                    document.getElementById("stg2future").style.display="none";
                    document.getElementById("stg3current").style.display="block";
                    document.getElementById("stg3complete").style.display="none";
                    document.getElementById("stg3future").style.display="none";
                }
            }


            // get the wrapper
            let wrapper = this.$refs['wrapper'];

            // set the actual height of the current section
            const el = this.$refs['stage-' + this._stage];
            if (el) {
                wrapper.style.height = el.offsetHeight + 'px';
            } else {
                wrapper.style.height = '0px';
            }

            // set the stage
            this._stage = nextStage;

            // update max
            if (this._stage > this._max) {
                this._max = this._stage;
            }

            // are we on to the form?
            if (this._stage == 3) {
                // Remove the 'name' attribute from all rate inputs to prevent them from being sent
                const form = this.$refs['donationIntroForm'];
                const rateInputs = form.querySelectorAll('input[name="rate"]');
                rateInputs.forEach(input => input.removeAttribute('name'));

                window.history.pushState("donate", null, null);
                form.submit();
                this._submit = true;
                // document.getElementById('stage3img').src = "images/progress complete.svg";
            } else {
                this._submit = false;
                this._loaded = false;
            }

            this.$nextTick(() => {
                // get the height of the new section
                const newEl = this.$refs['stage-' + this._stage];
                if (newEl) {
                    wrapper.style.height = newEl.offsetHeight + 'px';
                }

                // after animation, remove wrapper's height
                setTimeout(() => {
                    wrapper.style.height = '';
                }, 300);

                setTimeout(() => {
                    document.getElementById('demo-form-top').scrollIntoView({
                        behavior: 'smooth',
                    });
                }, 500);
            });
        },





        formLoaded(event) {
            if (this._stage == 3) {
                this._loaded = true;
            }
        }
    }));
});