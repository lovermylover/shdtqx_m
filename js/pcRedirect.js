

function autoRedirect() {
	let w = window.innerWidth;

	if (parseInt(w) > 960) {
		let pcHost = getPcHost();
		let pcHref = getPcHref();
		
		if (pcHost &&   location.host != pcHost ) {
			location.href = pcHref;
		}
	}

}


function getPcHost() {

	if (location.host.indexOf("localhost") == 0) {
		return location.host.replace(/(\d+)/,function($1){return parseInt($1)-1})
	}
	else if (location.host.indexOf("n.") == 0) {
		return location.host.replace("n.", "yyy.")
	}

	else if (location.host.indexOf("m.") == 0) {
		return location.host.replace("m.", "www.")
	}
	else return location.host;

}

function getPcHref() {
	let pcHost = getPcHost();
	if (pcHost) {
		return location.href.replace(location.host, pcHost);

	}
	return false;

}


const debounce = (fn, delay) => {
	let timer;
	return function() {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn();
		}, delay);
	}
};

const cancalDebounce = debounce(autoRedirect, 500);



window.addEventListener('resize', cancalDebounce);

autoRedirect();