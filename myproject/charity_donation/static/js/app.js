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

    validateQuantitiesOfBags(){
      let quantityOfBags = document.querySelector("#quantityOfBags")
      if (/^[1-9]\d*$/.test(quantityOfBags.value)) {
      }
      else{
        window.alert('Wprowadzona liczba worków jest błędna! Nie może być mniejsza od jeden. ');
        this.currentStep--;
      }
    }

    showingInstytuionWithCorrectCattegory(){
      const mainDiv3 = document.querySelector("#step3");
      mainDiv3.innerHTML = '';

      const h3 = document.createElement('h3');
      h3.innerText = 'Wybierz organizacje, której chcesz pomóc:';
      mainDiv3.appendChild(h3);

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

            mainDiv3.appendChild(institutionDiv);
        }
      });

      const divForButtons = document.createElement("div");
      divForButtons.className = "form-group form-group--buttons";
      mainDiv3.appendChild(divForButtons);

        const buttonPrev = document.createElement("button");
        buttonPrev.className = "btn prev-step";
        buttonPrev.innerText = "Wstecz";
        buttonPrev.addEventListener('click', e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
        divForButtons.appendChild(buttonPrev);
   
        const buttonNext = document.createElement("button");
        buttonNext.className = "btn next-step";
        buttonNext.innerText = "Dalej";
        buttonNext.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
        divForButtons.appendChild(buttonNext);

    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */

    

    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation
      if(this.currentStep == 2)this.saveCategories();
      if(this.currentStep == 3){ 
        this.validateQuantitiesOfBags();
        this.showingInstytuionWithCorrectCattegory();
      }
      
      this.slides.forEach(slide => {
        slide.classList.remove("active");
        
        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });
      
      
      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;
      
      // TODO: get data from inputs and show them in summary

    }

    /**
     * Submit form
     *
     * // TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      this.currentStep++;
      this.updateForm();
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});
