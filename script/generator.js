$('#file').change(async function (e) {
	let songs = e.currentTarget.files;
	let numberOfSongs = songs.length;
	let htmlFinalTracklistView = '';

	let startTime = 0;
	let startTimeSeconds = 0;
	let endTimeSeconds = 0;

	for (i = 0; i < numberOfSongs; i++) {
		let songLength = await getSongLength(songs[i], i);
		let songTitle = await getSongTitle(songs[i], i);

		endTimeSeconds = startTimeSeconds + songLength;
		startTime = convertSecondsToTimestamp(startTimeSeconds);
		endTime = convertSecondsToTimestamp(endTimeSeconds);
		htmlFinalTracklistView += '(' + startTime + ')' + ' ' + songTitle + '<br>';

		startTimeSeconds = endTimeSeconds;
	}
	document.getElementById('tracklist').innerHTML = htmlFinalTracklistView;
});

const convertSecondsToTimestamp = (seconds) => {
	let duration = moment.duration(seconds, 'seconds');
	let time = '';
	let hours = duration.hours();
	let append_s = '';
	let append_m = '';

	if (hours > 0) {
		time = hours + ':';
	}

	if (duration.seconds() < 10) {
		append_s = '0';
	}

	if (duration.minutes() < 10) {
		append_m = '0';
	}

	total_string =
		time + append_m + duration.minutes() + ':' + append_s + duration.seconds();
	return total_string;
};

const getSongTitle = (song) => {
	return new Promise(function (resolve, reject) {
		let filename = song.name;
		filename = filename.substr(0, filename.lastIndexOf('.'));
		resolve(filename);
	});
};

const getSongLength = (song) => {
	return new Promise(function (resolve, reject) {
		objectURL = URL.createObjectURL(song);
		mySound = new Audio([objectURL]);
		mySound.addEventListener('canplaythrough', function (e) {
			let seconds = e.currentTarget.duration;
			resolve(seconds);
		});
	});
};
