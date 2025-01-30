import React, { useState, useEffect } from 'react';
import {
  Search,
  Upload,
  FileText,
  Star,
  User,
  Filter,
  LogIn,
  LogOut,
  BookOpen,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

const API_BASE_URL = 'http://localhost:8080/api';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentTab, setCurrentTab] = useState('browse');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    subject: '',
    file: null
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/search?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error searching notes:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('note', new Blob([JSON.stringify({
      title: uploadData.title,
      description: uploadData.description,
      subject: uploadData.subject
    })], { type: 'application/json' }));

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      setCurrentTab('browse');
      fetchNotes();
    } catch (error) {
      console.error('Error uploading note:', error);
    }
  };

  const subjects = [
    "Mathematics",
    "History",
    "Science",
    "Literature",
    "Computer Science"
  ];

  const Header = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">StudyNotes</span>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setIsLoggedIn(true)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setCurrentTab('browse')}
            className={`px-3 py-2 text-sm font-medium ${
              currentTab === 'browse'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Browse Notes
          </button>
          <button
            onClick={() => setCurrentTab('upload')}
            className={`px-3 py-2 text-sm font-medium ${
              currentTab === 'upload'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload Notes
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className={`px-3 py-2 text-sm font-medium ${
              currentTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Profile
          </button>
        </div>
      </div>
    </nav>
  );

  const SearchBar = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg bg-white"
          value={selectedSubject}
          onChange={async (e) => {
            const subject = e.target.value;
            setSelectedSubject(subject);
            if (subject === 'all') {
              fetchNotes();
              return;
            }
            try {
              const response = await fetch(`${API_BASE_URL}/notes/subject/${subject}`);
              if (!response.ok) throw new Error('Failed to fetch notes by subject');
              const data = await response.json();
              setNotes(data);
            } catch (error) {
              console.error('Error fetching notes by subject:', error);
            }
          }}
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const NoteCard = ({ note }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{note.title}</span>
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
        </CardTitle>
        <CardDescription>{note.subject} • By {note.user?.fullName || 'Anonymous'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{note.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div className="flex space-x-4">
          <span className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {note.rating || 0}
          </span>
          <span className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            {note.downloads || 0}
          </span>
          <span className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {note.comments?.length || 0}
          </span>
        </div>
        <Dialog>
          <DialogTrigger className="text-blue-600 hover:text-blue-700">
            View Details
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{note.title}</DialogTitle>
              <DialogDescription>
                {note.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );

  const BrowseNotes = ({ notes }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );

  const UploadForm = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Notes</CardTitle>
          <CardDescription>Share your notes with other students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-lg"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                className="mt-1 w-full px-4 py-2 border rounded-lg bg-white"
                value={uploadData.subject}
                onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full px-4 py-2 border rounded-lg"
                rows={4}
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                required
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  Click to select your file
                </p>
              </label>
              {uploadData.file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {uploadData.file.name}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Notes
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <SearchBar />
      {currentTab === 'browse' && <BrowseNotes notes={notes} />}
      {currentTab === 'upload' && <UploadForm />}
      {currentTab === 'profile' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
        </div>
      )}
    </div>
  );
};

export default NotesApp;