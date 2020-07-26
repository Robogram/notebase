#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
extern crate serde;
extern crate serde_json;

use std::fs;
use rocket::request::{FromForm,Form};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct Note {
	topics: Vec<String>,
	notes: Vec<String>
}

#[derive(FromForm, Debug)]
struct FormInfo {
	note: String
}

#[derive(FromForm, Debug)]
struct FormTopics {
	topics: String
}

#[derive(Serialize, Deserialize, Debug)]
struct Topics {
	topics: Vec<String>
}

#[derive(Serialize, Deserialize, Debug)]
struct NewNote {
	topics: String,
	note: String
}

#[get("/")]
fn index() -> String {
	format!("Hello, {}", "World")
}

#[get("/get_all_topics")]
fn get_all_topics() -> String {
	let note_file = "src/notes.json";
	let file = fs::read_to_string(note_file).unwrap();
	let infos: Note = serde_json::from_str(&file).unwrap();
	let file_topics = infos.topics;
	let mut all_topics: Vec<String> = [].to_vec();
	let mut each_topics: Vec<String>;
	let mut valid_append;

	for file_topic in file_topics.iter() {
		each_topics = serde_json::from_str(&file_topic).unwrap();

		for each_topic in each_topics {
			valid_append = true;

			for topic in all_topics.iter() {
				if *topic == each_topic {
					valid_append = false;
				}
			}

			if valid_append == true {
				all_topics.push(each_topic);
			}
		}
	}

	format!("{:?}", all_topics)
}

#[post("/get_note", format="application/x-www-form-urlencoded", data="<request>")]
fn get_note(request: Form<FormTopics>) -> String {
	// get notes from file
	let note_file = "src/notes.json";
	let file = fs::read_to_string(note_file).unwrap();
	let infos: Note = serde_json::from_str(&file).unwrap();
	let mut note: String = "".to_string();

	// get topics from form
	let topics: String = request.topics.to_string();

	for (k, topic) in infos.topics.iter().enumerate() {
		if *topic == topics {
			note = infos.notes[k].to_string();
		}
	}

	format!("{:?}", note.to_string())
}

#[post("/save_info", format="application/x-www-form-urlencoded", data="<request>")]
fn save_info(request: Form<FormInfo>) -> String {
	// get notes from file
	let note_file = "src/notes.json";
	let file = fs::read_to_string(note_file).unwrap();
	let mut infos: Note = serde_json::from_str(&file).unwrap();

	// get new note from form
	let note_info: NewNote = serde_json::from_str(&request.note).unwrap();
	let topics = note_info.topics;
	let note = note_info.note;
	let mut topic_index: usize = 0;

	for (k, topic) in infos.topics.iter().enumerate() {
		if *topic == topics {
			topic_index = k + 1;
		}
	}

	if topic_index > 0 {
		infos.notes[topic_index - 1] = note;
	} else {
		infos.topics.push(topics);
		infos.notes.push(note);
	}

	let serialized = serde_json::to_string(&infos).unwrap();
	fs::write(note_file, serialized).expect("could not write to file");

	format!("{:?}", "succeed")
}

#[post("/delete_info", format="application/x-www-form-urlencoded", data="<request>")]
fn delete_info(request: Form<FormTopics>) -> String {
	// get notes from file
	let note_file = "src/notes.json";
	let file = fs::read_to_string(note_file).unwrap();
	let mut infos: Note = serde_json::from_str(&file).unwrap();
	let mut topic_index: usize = 0;

	// get note from form for deletion
	let topics: String = request.topics.to_string();

	for (k, topic) in infos.topics.iter().enumerate() {
		if *topic == topics {
			topic_index = k;
		}
	}

	infos.topics.remove(topic_index);
	infos.notes.remove(topic_index);

	let serialized = serde_json::to_string(&infos).unwrap();

	fs::write(note_file, serialized).expect("could not write to file");

	format!("{:?}", "succeed")
}

fn main() {
    rocket::ignite().mount("/", routes![index,get_all_topics,get_note,save_info,delete_info]).launch();
}
