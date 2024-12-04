function validateEmail(string) {
    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(string)) {
        return true;
    }
    return false;
}

function validatePhone(string) {
    if (/^[\+]?\d{2,}?[(]?\d{2,}[)]?[-\s\.]?\d{2,}?[-\s\.]?\d{2,}[-\s\.]?\d{0,9}$/im.test(string)) {
        return true;
    }
    return false;
}

function validateAmount(curr_amount, input_amount) {    
    if (input_amount > curr_amount){
        return true;
    }
    return false;
    
}

const urlParams = new URLSearchParams(window.location.search);
const old_amount = urlParams.get('amount');


document.addEventListener('alpine:init', () => {
    Alpine.data('form', () => ({
        amount: 75,
        choice: '',
        total: 0,

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

            //Set current donation amount
            let current_amount_str = "Your Current Donation: $" + urlParams.get('amount');
            document.getElementById("current_amount").innerHTML = current_amount_str;

            
            this.amount = urlParams.get('amount');
            this.total = this.amount; // define total

            document.getElementById('stage1img').src = "images/new progress current.svg"

            this.$watch('frequency', (frequency) => {
                // includes the amount in that frequency
                if (!this.amountOptions[frequency].includes(this.amount)) {
                    this.$nextTick(() => {
                        this.amount = this.amountDefaults[frequency]
                    })
                }
            });

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




            window.onpopstate = (event) => {
                if (this._submit) {
                    // form was submitted
                    history.go(-2);
                }
            };

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
                document.getElementById('stage1img').src = "images/new progress current.svg";
                document.getElementById('stage2img').src = "images/progress future.svg";
                document.getElementById('stage3img').src = "images/progress future.svg";
            }


            // reset errors
            this._errors = {};


            //validate stage 1
            if (this._stage == 1 && nextStage > this._stage){
                if (!this.total || !validateAmount(old_amount, this.total)) {
                    this._errors.amount = true;
                }
                

                if (Object.keys(this._errors).length) {
                    return;
                }
                else if (nextStage == 2) {
                    document.getElementById('stage1img').src = "images/new progress current.svg";
                    document.getElementById('stage2img').src = "images/new progress current.svg";
                    document.getElementById('stage3img').src = "images/progress future.svg";
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
                    } else if (!validatePhone(this.phone)) {
                        this._errors.phone = true;
                    }
                    /*
                    if (!this.mailing_street) {
                        this._errors.mailing_street = true;
                    }
                    if (!this.mailing_city) {
                        this._errors.mailing_city = true;
                    }
                    if (!this.mailing_state) {
                        this._errors.mailing_state = true;
                    }
                    if (!this.mailing_postal_code) {
                        this._errors.mailing_postal_code = true;
                    } */
                }

                if (Object.keys(this._errors).length) {
                    return;
                }
                else if (nextStage == 3) {
                    document.getElementById('stage1img').src = "images/new progress current.svg";
                    document.getElementById('stage2img').src = "images/new progress current.svg";
                    document.getElementById('stage3img').src = "images/new progress current.svg";
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
                window.history.pushState("donate", null, null);
                this.$refs['donationIntroForm'].submit();
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