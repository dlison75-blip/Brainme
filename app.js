class BrainMe {
    constructor() {
      this.storageKey = 'brainme-thoughts';
  
      // DOM elements
      this.textarea = document.getElementById('thought-input');
      this.saveBtn = document.getElementById('save-btn');
      this.clearInputBtn = document.getElementById('clear-input-btn');
      this.clearAllBtn = document.getElementById('clear-all-btn');
      this.exportTxtBtn = document.getElementById('export-txt-btn');
      this.exportJsonBtn = document.getElementById('export-json-btn');
      this.searchInput = document.getElementById('search-input');
      this.list = document.getElementById('thoughts-list');
  
      // State
      this.thoughts = [];
      this.searchTerm = '';
  
      this.loadThoughts();
      this.bindEvents();
      this.render();
    }
  
    bindEvents() {
      this.saveBtn.addEventListener('click', () => this.saveCurrentThought());
      this.clearInputBtn.addEventListener('click', () => this.clearInput());
      this.clearAllBtn.addEventListener('click', () => this.clearAll());
      this.exportTxtBtn.addEventListener('click', () => this.exportTxt());
      this.exportJsonBtn.addEventListener('click', () => this.exportJson());
  
      this.textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
          this.saveCurrentThought();
        }
      });
  
      this.searchInput.addEventListener('input', () => {
        this.searchTerm = this.searchInput.value.toLowerCase();
        this.render();
      });
    }
  
    loadThoughts() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        this.thoughts = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(this.thoughts)) {
          this.thoughts = [];
        }
      } catch (e) {
        console.error('Error loading thoughts:', e);
        this.thoughts = [];
      }
    }
  
    persist() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.thoughts));
      } catch (e) {
        console.error('Error saving thoughts:', e);
      }
    }
  
    saveCurrentThought() {
      const text = this.textarea.value.trim();
      if (!text) return;
  
      const thought = {
        id: Date.now(),
        text,
        createdAt: new Date().toISOString(),
      };
  
      this.thoughts.unshift(thought);
      this.persist();
      this.render();
      this.textarea.value = '';
    }
  
    clearInput() {
      this.textarea.value = '';
    }
  
    clearAll() {
      if (!confirm('Clear ALL saved thoughts?')) return;
      this.thoughts = [];
      this.persist();
      this.render();
    }
  
    deleteThought(id) {
      this.thoughts = this.thoughts.filter(t => t.id !== id);
      this.persist();
      this.render();
    }
  
    getFilteredThoughts() {
      if (!this.searchTerm) return this.thoughts;
      return this.thoughts.filter(t =>
        t.text.toLowerCase().includes(this.searchTerm)
      );
    }
  
    render() {
      this.list.innerHTML = '';
  
      const filtered = this.getFilteredThoughts();
  
      if (filtered.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = this.thoughts.length === 0
          ? 'No thoughts saved yet.'
          : 'No thoughts match your search.';
        empty.className = 'empty';
        this.list.appendChild(empty);
        return;
      }
  
      for (const t of filtered) {
        const li = document.createElement('li');
  
        const main = document.createElement('div');
        main.className = 'thought-text';
        main.textContent = t.text;
  
        const meta = document.createElement('div');
        meta.className = 'thought-meta';
        meta.textContent = new Date(t.createdAt).toLocaleString();
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => this.deleteThought(t.id));
  
        li.appendChild(main);
        li.appendChild(meta);
        li.appendChild(deleteBtn);
  
        this.list.appendChild(li);
      }
    }
  
    exportTxt() {
      if (this.thoughts.length === 0) {
        alert('No thoughts to export.');
        return;
      }
  
      const lines = this.thoughts.map(t => {
        const date = new Date(t.createdAt).toLocaleString();
        return `[${date}] ${t.text}`;
      });
  
      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      this.triggerDownload(blob, 'brainme-thoughts.txt');
    }
  
    exportJson() {
      if (this.thoughts.length === 0) {
        alert('No thoughts to export.');
        return;
      }
  
      const json = JSON.stringify(this.thoughts, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      this.triggerDownload(blob, 'brainme-thoughts.json');
    }
  
    triggerDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    new BrainMe();
  });





