const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const note_file = "notes.json"

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", function (req, res) {
	res.send("Hello, World")
})

app.get("/get_all_topics", async(req, res) => {
	var file = await fs.readFileSync(note_file)
	var infos = JSON.parse(file)
	var topics = infos.topics
	var all_topics = [], each_topics, valid_append

	topics.forEach(function (topic) {
		each_topics = JSON.parse(topic)

		each_topics.forEach(function (each_topic) {
			valid_append = true

			all_topics.forEach(function (topic) {
				if (topic == each_topic) {
					valid_append = false
				}
			})

			if (valid_append) {
				all_topics.push(each_topic)
			}
		})
	})

	res.json({ 'error': false, 'topics': all_topics })
})

app.post("/get_note", async(req, res) => {
	var file = await fs.readFileSync(note_file)
	var infos = JSON.parse(file)
	var note = "", topics = req.body.topics

	infos.topics.forEach(function (topic, index) {
		if (topic == topics) {
			note = infos.notes[index]
		}
	})

	res.json({ 'error': false, 'note': note })
})

app.post("/save_info", async(req, res) => {
	var file = await fs.readFileSync(note_file)
	var infos = JSON.parse(file)

	// get new note from form
	var note_info = JSON.parse(req.body.note)
	var topics = note_info.topics
	var note = note_info.note
	var topic_index = 0

	infos.topics.forEach(function (topic, index) {
		if (topic == topics) {
			topic_index = index + 1
		}
	})

	if (topic_index > 0) {
		infos.notes[topic_index - 1] = note
	} else {
		infos.topics.push(topics)
		infos.notes.push(note)
	}

	infos = JSON.stringify(infos)

	await fs.writeFileSync(infos)

	res.json({ 'error': false })
})

app.post("/delete_info", async(req, res) => {
	var file = await fs.readFileSync(note_file)
	var infos = JSON.parse(file)
	var topic_index = 0

	// get note from form for deletion
	var topics = req.body.topics

	infos.topics.forEach(function (topic, index) {
		if (topic == topics) {
			topic_index = index
		}
	})

	infos.topics.splice(topic_index, 1)
	infos.notes.splice(topic_index, 1)

	infos = JSON.stringify(infos)

	await fs.writeFileSync(infos)

	res.json({ 'error': false })
})

app.listen(1000, () => {
	console.log("Listening on port: 1000");
})
