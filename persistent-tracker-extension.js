// persistent-tracker-extension-safe.js

class PersistentTrackerExtension {
  constructor(config = {}) {
    // Load saved trackers from localStorage safely
    let savedTrackers;
    try {
      savedTrackers = JSON.parse(localStorage.getItem('customTrackers'));
    } catch (e) {
      savedTrackers = [];
    }

    if (!Array.isArray(savedTrackers)) savedTrackers = [];

    this.config = {
      trackers: savedTrackers,
      ...config
    };

    // Ensure trackers is always an array
    if (!Array.isArray(this.config.trackers)) {
      this.config.trackers = [];
    }

    this.initUI();
  }

  // Save tracker list
  saveTrackers() {
    localStorage.setItem('customTrackers', JSON.stringify(this.config.trackers));
  }

  // Initialize UI
  initUI() {
    this.container = document.createElement('div');
    this.container.style.padding = '10px';
    this.container.style.backgroundColor = '#f0f0f0';
    this.container.style.border = '1px solid #ccc';
    this.container.style.marginBottom = '10px';

    const title = document.createElement('h3');
    title.textContent = 'Custom Trackers';
    this.container.appendChild(title);

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Enter tracker URL (udp:// or http(s)://)';
    this.input.style.width = '70%';
    this.container.appendChild(this.input);

    this.addBtn = document.createElement('button');
    this.addBtn.textContent = 'Add';
    this.addBtn.style.marginLeft = '5px';
    this.container.appendChild(this.addBtn);

    this.list = document.createElement('ul');
    this.list.style.marginTop = '10px';
    this.container.appendChild(this.list);

    document.body.appendChild(this.container);

    this.addBtn.addEventListener('click', () => this.addTracker());
    this.renderList();
  }

  // Validate tracker URL
  isValidTracker(url) {
    return /^((udp|http|https):\/\/)[\w.-]+(:\d+)?\/announce$/.test(url);
  }

  // Add tracker safely
  addTracker() {
    const url = this.input.value.trim();
    if (!url) return;

    if (!this.isValidTracker(url)) {
      alert('Invalid tracker URL! Must start with udp://, http://, or https:// and end with /announce');
      return;
    }

    if (!Array.isArray(this.config.trackers)) {
      this.config.trackers = [];
    }

    if (this.config.trackers.includes(url)) {
      alert('Tracker already exists!');
      return;
    }

    this.config.trackers.push(url);
    this.input.value = '';
    this.saveTrackers();
    this.renderList();
    console.log('[PersistentTrackerExtension] Tracker added:', url);
  }

  // Remove tracker safely
  removeTracker(index) {
    if (!Array.isArray(this.config.trackers)) return;
    const removed = this.config.trackers.splice(index, 1);
    this.saveTrackers();
    this.renderList();
    console.log('[PersistentTrackerExtension] Tracker removed:', removed[0]);
  }

  // Render tracker list safely
  renderList() {
    this.list.innerHTML = '';
    if (!Array.isArray(this.config.trackers)) this.config.trackers = [];
    for (const [idx, tracker] of this.config.trackers.entries()) {
      const li = document.createElement('li');
      li.textContent = tracker + ' ';
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.marginLeft = '5px';
      removeBtn.onclick = () => this.removeTracker(idx);
      li.appendChild(removeBtn);
      this.list.appendChild(li);
    }
  }

  // Fetch torrent with trackers safely
  async fetchTorrent(magnetURI) {
    console.log('[PersistentTrackerExtension] Fetching torrent:', magnetURI);

    const trackers = Array.isArray(this.config.trackers) ? this.config.trackers : [];
    for (const tracker of trackers) {
      console.log('Using tracker:', tracker);
    }

    // Example integration with WebTorrent
    // const client = new WebTorrent();
    // client.add(magnetURI, { announce: trackers });
  }
}

export default PersistentTrackerExtension;
