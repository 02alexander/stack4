#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::response::NamedFile;
use rocket_contrib::serve::StaticFiles;

#[get("/")]
fn index() -> Option<NamedFile> {
	NamedFile::open("site/index.html").ok()
}

fn main() {
	rocket::ignite().mount("/static", StaticFiles::from("static")).mount("/", routes![index]).launch();
}
