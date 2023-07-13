const getLocationInfo = (e) => {
	e.preventDefault();

	// Fetch the location
	if (pincode.value.length === 0) {
		alert('Field cannot be empty');
		return;
	}

	document.querySelector('.locationInfo').innerHTML = '';

	fetch(`https://api.postalpincode.in/pincode/${pincode.value}`)
		.then(response => response.json())
		.then(data => {
			data.forEach(dataItems => {
				if (dataItems.Status !== 'Success' || dataItems.Status === 404) {
					showIcon('remove');
					const errorMessage = `
			  <article class="message is-danger">
				<div class="message-header">
				  <p>Location</p>
				  <button class="delete" aria-label="delete"></button>
				</div>
				<div class="message-body">
				  ${dataItems.Message}
				</div>
			  </article>
			`;
					document.querySelector('.locationInfo').innerHTML = errorMessage;
				} else {
					showIcon('check');
					const postoffice = dataItems.PostOffice[0];
					const pos = Object.keys(postoffice).map(key => {
						return postoffice[key] && (`
				<div class="message-header mb-3">
				  <p>${key}</p>
				</div>
				<div class="message-body">
				  <strong>${postoffice[key]}</strong>
				</div>
			  `);
					}).join('');

					const successMessage = "<article class='message is-primary'>" + pos +
						"</article>";
					document.querySelector('.locationInfo').innerHTML = successMessage;
				}
			})
		});
}

const showIcon = (status) => {
	const removeIcon = document.querySelector(".icon-remove");
	const checkIcon = document.querySelector(".icon-check");

	removeIcon.style.display = "none";
	checkIcon.style.display = "none";

	const statusIcon = document.querySelector(`.icon-${status}`);
	statusIcon.style.display = "inline-flex";
}

const deleteText = (e) => {
	if (e.target.className == 'delete') {
		document.querySelector('.locationInfo').remove();
		document.querySelector('.pincode').value = '';
		const checkIcon = document.querySelector(".icon-check");
		if (checkIcon) {
			checkIcon.remove();
		}
	}
}

zipform.addEventListener('submit', getLocationInfo);
document.querySelector('body').addEventListener('click', deleteText);