const form = document.querySelector('#form');
const fullNameInput = document.querySelector('#fullName');
const subjectInput = document.querySelector('#subject');
const emailAddressInput = document.querySelector('#emailAddress');
const phoneNumberInput = document.querySelector('#phoneNumber');
const messageInput = document.querySelector('#message');


let validFullName;
let validSubject;
let validEmailAddress;
let validPhoneNumber;
let validMessage;

const cancelButton = document.querySelector('#cancel');
const submitButton = document.querySelector('#submit');
const formSubmissionStatus = document.querySelector('#formSubmissionStatus');


cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.reset();

    fullNameInput.classList.remove('bg-red-600');
    fullNameInput.style.backgroundColor = '';
    fullNameInput.classList.add('bg-gray-200');

    subjectInput.classList.remove('bg-red-600');
    subjectInput.style.backgroundColor = '';
    subjectInput.classList.add('bg-gray-200');

    emailAddressInput.classList.remove('bg-red-600');
    emailAddressInput.style.backgroundColor = '';
    emailAddressInput.classList.add('bg-gray-200');

    phoneNumberInput.classList.remove('bg-red-600');
    phoneNumberInput.style.backgroundColor = '';
    phoneNumberInput.classList.add('bg-gray-200');

    messageInput.classList.remove('bg-red-600');
    messageInput.style.backgroundColor = '';
    messageInput.classList.add('bg-gray-200');
});


const validateFullName = () => {
    const fullName = fullNameInput.value;
    if (!fullName.match(/^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/)) {
        fullNameInput.classList.remove('bg-gray-200');
        fullNameInput.style.backgroundColor = '';
        fullNameInput.classList.add('bg-red-600', 'text-white');
        validFullName = false;
    }
    if ((!fullName)) {
        fullNameInput.classList.remove('bg-red-600', 'text-white');
        fullNameInput.style.backgroundColor = '';
        fullNameInput.classList.add('bg-gray-200');
        validFullName = undefined;
    }
    else if (fullName.match(/^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/)) {
        fullNameInput.classList.remove('bg-gray-200', 'bg-red-600');
        fullNameInput.classList.add('text-white');
        fullNameInput.style.backgroundColor = 'rgb(21, 128, 61)';
        validFullName = true;
    }
};

fullNameInput.addEventListener('input', () => {
    validateFullName();
});


const validateSubject = () => {
    const subject = subjectInput.value;
    if (!subject.match(/.{3,}/)) {
        subjectInput.classList.remove('bg-gray-200');
        subjectInput.style.backgroundColor = '';
        subjectInput.classList.add('bg-red-600', 'text-white');
        validSubject = false;
    }
    if ((!subject)) {
        subjectInput.classList.remove('bg-red-600', 'text-white');
        subjectInput.style.backgroundColor = '';
        subjectInput.classList.add('bg-gray-200');
        validSubject = undefined;
    }
    else if (subject.match(/.{3,}/)) {
        subjectInput.classList.remove('bg-gray-200', 'bg-red-600');
        subjectInput.classList.add('text-white');
        subjectInput.style.backgroundColor = 'rgb(21, 128, 61)';
        validSubject = true;
    }
};

subjectInput.addEventListener('input', () => {
    validateSubject();
});


const validateEmailAddress = () => {
    const emailAddress = emailAddressInput.value;
    if (!emailAddress.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        emailAddressInput.classList.remove('bg-gray-200');
        emailAddressInput.style.backgroundColor = '';
        emailAddressInput.classList.add('bg-red-600', 'text-white');
        validEmailAddress = false;
    }
    if ((!emailAddress)) {
        emailAddressInput.classList.remove('bg-red-600', 'text-white');
        emailAddressInput.style.backgroundColor = '';
        emailAddressInput.classList.add('bg-gray-200');
        validEmailAddress = undefined;

    }
    else if (emailAddress.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        emailAddressInput.classList.remove('bg-gray-200', 'bg-red-600');
        subjectInput.classList.add('text-white');
        emailAddressInput.style.backgroundColor = 'rgb(21, 128, 61)';
        validEmailAddress = true;

    }
};

emailAddressInput.addEventListener('input', () => {
    validateEmailAddress();
});


const validatePhoneNumber = () => {
    const phoneNumber = phoneNumberInput.value;
    if (!phoneNumber.match(/^(\d\s*?){10}$/)) {
        phoneNumberInput.classList.remove('bg-gray-200');
        phoneNumberInput.style.backgroundColor = '';
        phoneNumberInput.classList.add('bg-red-600', 'text-white');
        validPhoneNumber = false;
    }
    if ((!phoneNumber)) {
        phoneNumberInput.classList.remove('bg-red-600', 'text-white');
        phoneNumberInput.style.backgroundColor = '';
        phoneNumberInput.classList.add('bg-gray-200');
        validPhoneNumber = undefined;
    }
    else if (phoneNumber.match(/^(\d\s*?){10}$/)) {
        phoneNumberInput.classList.remove('bg-gray-200', 'bg-red-600');
        subjectInput.classList.add('text-white');
        phoneNumberInput.style.backgroundColor = 'rgb(21, 128, 61)';
        validPhoneNumber = true;
    }
};

phoneNumberInput.addEventListener('input', () => {
    validatePhoneNumber();
});


const validateMessage = () => {
    const message = messageInput.value;
    if (!message.match(/.{40,}/)) {
        messageInput.classList.remove('bg-gray-200');
        messageInput.style.backgroundColor = '';
        messageInput.classList.add('bg-red-600', 'text-white');
        validMessage = false;
    }
    if ((!message)) {
        messageInput.classList.remove('bg-red-600', 'text-white');
        messageInput.style.backgroundColor = '';
        messageInput.classList.add('bg-gray-200');
        validMessage = undefined;
    }
    else if (message.match(/.{40,}/)) {
        messageInput.classList.remove('bg-gray-200', 'bg-red-600');
        subjectInput.classList.add('text-white');
        messageInput.style.backgroundColor = 'rgb(21, 128, 61)';
        validMessage = true;
    }
};

messageInput.addEventListener('input', () => {
    validateMessage();
});


const formValidityCheck = () => {
    return (
        validFullName === true &&
        validSubject === true &&
        validEmailAddress === true &&
        validPhoneNumber === true &&
        validMessage === true
    );
};


const submitFormData = () => {
    const formData = new URLSearchParams(new FormData(form));

    fetch('https://montoyamasonry.co/api/submit-form', {
        method: 'POST',
        body: formData,
    })
    .then((res) => {
        console.log('Response Status Code:', res.status);
        if (res.ok) {
            form.reset();
            fullNameInput.style.backgroundColor = '';
            fullNameInput.classList.add('bg-gray-200');
            subjectInput.style.backgroundColor = '';
            subjectInput.classList.add('bg-gray-200');
            emailAddressInput.style.backgroundColor = '';
            emailAddressInput.classList.add('bg-gray-200');
            phoneNumberInput.style.backgroundColor = '';
            phoneNumberInput.classList.add('bg-gray-200');
            messageInput.style.backgroundColor = '';
            messageInput.classList.add('bg-gray-200');
            formSubmissionStatus.textContent = 'Form submitted successfully!';
            formSubmissionStatus.classList.remove('bg-black');
            formSubmissionStatus.style.backgroundColor = 'rgb(21, 128, 61)';
        } else {
            formSubmissionStatus.textContent = 'Form submission failed';
            formSubmissionStatus.classList.remove('bg-black');
            formSubmissionStatus.style.backgroundColor = '';
            formSubmissionStatus.classList.add('bg-red-600');
        }
    })
    .catch((error) => {
        console.error('Fetch Error:', error);
        formSubmissionStatus.textContent = 'An error occured, please try again.';
        formSubmissionStatus.classList.add('bg-black', 'text-white-700');
    });
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(formValidityCheck()) {
        submitButton.disabled = true;
        formSubmissionStatus.textContent = 'Submitting...';
        formSubmissionStatus.classList.add('bg-black', 'text-white');

        setTimeout(() => {
            submitFormData();
        }, 500);
    }
});