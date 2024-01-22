document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   * 
   */

  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }


// TODO: callback to page change event

    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;
      this.tabOfCheckedBoxes = []
      this.bodyToSave;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    saveCategories() {
        this.tabOfCheckedBoxes = []
        const allCheckBoxes = document.querySelectorAll(".checkbox_categories");
        allCheckBoxes.forEach(element => {
          if (element.checked == true) {
            this.tabOfCheckedBoxes.push(parseInt(element.value));
          }
        });
        if(this.tabOfCheckedBoxes.length < 1){
          window.alert('Musisz zaznaczyć chociaż jedną kategorię.');
          this.currentStep--;
        }
    } 

    spanQuantity = document.createElement("span"); // span to function validateQuantitiesOfBags

    validateQuantitiesOfBags(){
      let quantityOfBags = document.querySelector("#quantityOfBags")
      if (/^[1-9]\d*$/.test(quantityOfBags.value)) {
        this.spanQuantity.innerText = '';
        quantityOfBags.style.backgroundColor = '';
      }
      else{
        quantityOfBags.style.backgroundColor = '#FFDDDD';
        this.spanQuantity.innerText = ' Worków musi być więcej niż 0!';
        this.spanQuantity.style.color = '#FF3333';
        this.spanQuantity.style.fontWeight = 'bold';
        quantityOfBags.parentElement.appendChild(this.spanQuantity);
        this.currentStep--;
      }
    }

    showingInstytuionWithCorrectCattegory(){
      const mainDiv3 = document.querySelector("#step3");

      //REMOVING OLD CHILDRENS
      for(let i = mainDiv3.children.length - 2; i>= 1; i--){
        mainDiv3.removeChild(mainDiv3.children[i])
      }

      instituions.forEach(instituion => {

        let present = true;
        for (let i = 0; i < this.tabOfCheckedBoxes.length; i++) {
          let cat = this.tabOfCheckedBoxes[i];
        
          if (!instituion.fields.categories.includes(cat)) {
            present = false;
            break;
          }
        }

        if (present) {    

          const institutionDiv = document.createElement('div');
          institutionDiv.className = 'form-group form-group--checkbox';

            const institutionLabel = document.createElement('label');
            institutionDiv.appendChild(institutionLabel);

              const labelInput = document.createElement("input");
              labelInput.type = "radio";
              labelInput.name = "organization";
              labelInput.value = instituion.pk;
              institutionLabel.appendChild(labelInput)

              const spanCheckboxLabel = document.createElement("span");
              spanCheckboxLabel.className = "checkbox radio";
              institutionLabel.appendChild(spanCheckboxLabel);

              const spanDescriptionLabel = document.createElement("span");
              spanDescriptionLabel.className = "description";
              institutionLabel.appendChild(spanDescriptionLabel);

                const spanDescriptionDiv = document.createElement("div");
                spanDescriptionDiv.className = "title"
                if (instituion.fields.institution_type == "FOU") spanDescriptionDiv.innerText = `Fundacja "${instituion.fields.name}"`;
                if (instituion.fields.institution_type == "NGO") spanDescriptionDiv.innerText = `Organizacjia pozarządowa "${instituion.fields.name}"`;
                if (instituion.fields.institution_type == "LC") spanDescriptionDiv.innerText = `Lokalna zbiórka  "${instituion.fields.name}"`;
                spanDescriptionLabel.appendChild(spanDescriptionDiv);

                const spanSubtitleDiv = document.createElement("div");
                spanSubtitleDiv.className = "subtitle";
                spanSubtitleDiv.innerHTML = `${instituion.fields.description}`
                spanDescriptionLabel.appendChild(spanSubtitleDiv);

            mainDiv3.insertBefore(institutionDiv, mainDiv3.children[1]);
        }
      });

    }


    step3valid(){
      const step3inputs = document.querySelectorAll("#step3 > div > label > input");
      let checked = false
      for (let i = 0; i < step3inputs.length; i++) {
        if (step3inputs[i].checked){
          checked = true
        }
      }
      if (!checked) {
        window.alert('Przynajmniej jedno pole musi być zaznaczone!');
        this.currentStep--;
      }
    }

    dataAndTime(){
      const data = document.querySelector('input[name="data"]');
    //   const time = document.querySelector('input[name="time"]');

    //   const today = new Date().getDay();
      let monday = new Date();

      data.min = monday.toISOString().split('T')[0];

    }

    step4valid(){
      const address = document.querySelector('input[name="address"]');
      const city = document.querySelector('input[name="city"]');
      const postcode = document.querySelector('input[name="postcode"]');
      const phone = document.querySelector('input[name="phone"]');
      const time = document.querySelector('input[name="time"]');
      let controlNumber = 0

      if (address.value < 1) {
        address.placeholder = 'Musisz podać adres!';
        address.style.backgroundColor = '#FFDDDD';
        controlNumber = 1
      }

      if (city.value < 1) {
        city.placeholder = 'Musisz podać miasto!';
        city.style.backgroundColor = '#FFDDDD';
        controlNumber = 1
      }

      if (!/^\d{2}-\d{3}$/.test(postcode.value)) {
        postcode.placeholder = 'Kod musi mieć format 00-000';
        postcode.style.backgroundColor = '#FFDDDD';
        controlNumber = 1
      }

      if (!/^\d{9}$/.test(phone.value)) {
        phone.placeholder = 'Numer jest za krótki!';
        phone.value = '';
        phone.style.backgroundColor = '#FFDDDD';
        controlNumber = 1
      }

      if(time.value.length < 4) {
        time.style.backgroundColor = '#FFDDDD';
        controlNumber = 1
      } 
      else{
        time.style.backgroundColor = "";
      }


      this.currentStep -= controlNumber;
    }

    formdata;
    
    step5Summary(){
      this.formdata = new FormData(document.querySelector('form'));

      if (this.formdata.get('more_info') < 1) {
        this.formdata.set('more_info', 'Brak uwag.')
      }

      let instituionToShow, quantityOfBags;

      instituions.forEach(institution => {
        if (institution.pk == this.formdata.get('organization')) {
          instituionToShow = institution
        }
      });

      if(this.formdata.get('bags') == 1)
      {quantityOfBags = 'Oddajesz potrzebującym 1 worek, dziękujemy :)'}
      else if(this.formdata.get('bags') < 5)
      {quantityOfBags = `Oddajesz potrzebującym ${this.formdata.get('bags')} worki, hojny gest, dziękujemy!`}
      else
      {quantityOfBags = `Oddajesz potrzebującym ${this.formdata.get('bags')} worków! Jesteś prawdziwym dobroczyńcą!`}

      let summaryDiv = document.querySelector('.summary');
      summaryDiv.innerHTML = ''

      let formSection1 = document.createElement('div');
      formSection1.className = 'form-section';

      formSection1.innerHTML = 
      `<h4>Oddajesz:</h4>
      <ul>
        <li>
          <span class="icon icon-bag"></span>
          <span class="summary--text">${quantityOfBags}</span>
        </li>
        <li>
          <span class="icon icon-hand"></span>
          <span class="summary--text">Dla " ${instituionToShow.fields.name} "</span>
        </li>
      </ul>`;

      summaryDiv.appendChild(formSection1);

      let formSection2 = document.createElement(`div`);
      formSection2.className = `form-section form-section--columns`;

      let formSectionColumn1 = document.createElement(`div`);
      formSectionColumn1.className = `form-section--column`;
      formSectionColumn1.innerHTML = `<h4>Adres odbioru:</h4><ul><li>${this.formdata.get('address')}</li><li>${this.formdata.get('city')}</li><li>${this.formdata.get('postcode')}</li><li>${this.formdata.get('phone')}</li></ul>`;
      formSection2.appendChild(formSectionColumn1);

      let formSectionColumn2 = document.createElement(`div`);
      formSectionColumn2.className = `form-section--column`;
      formSectionColumn2.innerHTML = `<h4>Termin odbioru:</h4><ul><li>${this.formdata.get('data')}</li><li>${this.formdata.get('time')}</li><li>${this.formdata.get('more_info')}</li></ul>`;
      formSection2.appendChild(formSectionColumn2);

      summaryDiv.appendChild(formSection2);

    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */

    

    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation
      if(this.currentStep == 2) this.saveCategories();
      if(this.currentStep == 3){ 
        this.validateQuantitiesOfBags();
        this.showingInstytuionWithCorrectCattegory();
      }
      if (this.currentStep == 4){
        this.step3valid()
        this.dataAndTime()
      };
      if (this.currentStep == 5) this.step4valid();
            
      this.slides.forEach(slide => {
        slide.classList.remove("active");
        
        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });
      
      if (this.currentStep == 5) this.step5Summary()
      
      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;
      

    }

    /**
     * Submit form
     *
     * // TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      
      console.log(this.formdata)

      fetch('/formularz/', {
        method: "POST",
        body: this.formdata,
      })
        .then(res => res)
        .then(data => console.log(JSON.stringify(data)))
        .catch(err => console.log(err));



      this.currentStep++;
      this.updateForm();

      const form = document.querySelector('form');
      console.log(form)
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});
