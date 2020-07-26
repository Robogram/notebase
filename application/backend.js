async function getAllTopics() {
	var response = await fetch(url + 'get_all_topics')
	var { error, topics } = await response.json()

	all_topics = topics
}

function getNote() {
	var params = new URLSearchParams()

	params.append('topics', JSON.stringify(selected_topics))

	fetch(url + 'get_note', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	})
	.then((response) => response.json())
	.then((response) => {
		info.value = response ? response : ''

		while (info.value.replace("\"\"", "") != info.value) {
			info.value = info.value.replace("\"\"", "'")
		}

		delete_button.style.display = response ? "block" : "none"
	})
	.catch((error) => {

	})
}

function saveInfo() {
	var params = new URLSearchParams(), blank = false
	var inputValue = document.getElementById("info").value
	var info = { topics: [], note: "" }

	topics.forEach(function ({ topic }, index) {
		if (!topic) {
			if (index < topics.length - 1) {
				blank = true

				errormsg.innerHTML = "Blank Detected"
			}
		}
	})

	if (!inputValue) {
		errormsg.innerHTML = "Write something"
	}

	if (!blank && inputValue) {
		errormsg.innerHTML = ""

		all_topics = all_topics.concat(selected_topics)
		info.topics = JSON.stringify(selected_topics)
		info.note = inputValue
		new_topic.value = ""

		while (info.note.replace("'", "") != info.note) {
			info.note = info.note.replace("'", "\"\"")
		}

		params.append('note', JSON.stringify(info))

		fetch(url + 'save_info', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params
		})
		.then((response) => response.json())
		.then((response) => {
			var { error } = response
			
			if (!error) {
				delete_button.style.display = "block"

				hidden_box.style.display = "flex"
				save_confirm_box.style.display = "flex"

				setTimeout(function () {
					hidden_box.style.display = "none"
					save_confirm_box.style.display = "none"
				}, 1000)
			}
		})
		.catch((error) => {

		})
	}
}

async function deleteInfo() {
	var params = new URLSearchParams()
	var options, response, json

	params.append('topics', JSON.stringify(selected_topics))

	hidden_box.style.display = "flex"
	delete_confirm_box.style.display = "flex"

	options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	}

	try {
		response = await fetch(url + 'delete_info', options)
		json = await response.json()

		if (json == 'succeed') {
			delete_button.style.display = "none"

			setTimeout(function () {
				hidden_box.style.display = "none"
				delete_confirm_box.style.display = "none"
			}, 1000)
		}
	} catch(e) {

	}
}
