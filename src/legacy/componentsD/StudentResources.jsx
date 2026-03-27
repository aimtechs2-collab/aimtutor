// // components/StudentResources.jsx
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   FileText,
//   Video,
//   Download,
//   BookOpen,
//   File,
//   Clock,
//   FileImage,
//   FileSpreadsheet,
//   Music,
//   Archive,
//   AlertCircle,
//   Play,
//   Layers,
//   GraduationCap,
//   X,
//   Loader2,
//   ExternalLink,
//   Search,
//   Filter,
//   FolderOpen,
//   Phone,
//   Mail,
//   ChevronDown,
//   PlayCircle,
//   FileDown,
//   Eye,
//   Grid3X3,
//   LayoutList
// } from 'lucide-react';
// import api from '../utils/api';

// const BASE_URL = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads';

// const CONTACT_INFO = {
//   phone: "9700187077",
//   email: "support@aimtutor.in"
// };

// export default function StudentResources() {
//   // Data State
//   const [allResources, setAllResources] = useState([]);
//   const [allVideos, setAllVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI State
//   const [activeTab, setActiveTab] = useState('all'); // 'all', 'videos', 'documents'
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [downloadingId, setDownloadingId] = useState(null);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
//   const [courses, setCourses] = useState([]);

//   const videoRef = useRef(null);

//   // Fetch Data
//   useEffect(() => {
//     fetchAllResources();
//   }, []);

//   // Escape key handler
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && selectedVideo) {
//         handleCloseVideo();
//       }
//     };
//     window.addEventListener('keydown', handleEscape);
//     return () => window.removeEventListener('keydown', handleEscape);
//   }, [selectedVideo]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (videoRef.current) videoRef.current.pause();
//     };
//   }, []);

//   const getFullUrl = useCallback((path) => {
//     if (!path) return null;
//     if (path.startsWith('http://') || path.startsWith('https://')) return path;
//     const cleanPath = path.startsWith('/') ? path.slice(1) : path;
//     return `${BASE_URL}/${cleanPath}`;
//   }, []);

//   const fetchAllResources = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/api/v1/users/get-dashboard');
//       const coursesData = response.data.recent_activity || [];
//       const enrolled = coursesData.filter(course => course.enrollment);

//       if (enrolled.length === 0) {
//         setLoading(false);
//         return;
//       }

//       // Fetch all course details
//       const coursePromises = enrolled.map(course =>
//         api.post(`/api/v1/courses/get-courses/${course.id}?lessons=True&resources=True`)
//           .then(res => res.data.course)
//           .catch(() => null)
//       );

//       const coursesWithData = (await Promise.all(coursePromises)).filter(Boolean);
//       setCourses(coursesWithData);

//       // Extract all videos and resources
//       const videos = [];
//       const resources = [];

//       coursesWithData.forEach(course => {
//         course.modules?.forEach(module => {
//           module.lessons?.forEach(lesson => {
//             // Add videos
//             if (lesson.video_url) {
//               videos.push({
//                 id: `video-${lesson.id}`,
//                 title: lesson.title,
//                 url: lesson.video_url,
//                 duration: lesson.duration_minutes,
//                 courseName: course.title,
//                 courseId: course.id,
//                 moduleName: module.title,
//                 lessonOrder: lesson.order,
//                 thumbnail: course.thumbnail
//               });
//             }

//             // Add resources
//             lesson.resources?.forEach(resource => {
//               resources.push({
//                 ...resource,
//                 lessonTitle: lesson.title,
//                 courseName: course.title,
//                 courseId: course.id,
//                 moduleName: module.title
//               });
//             });
//           });
//         });
//       });

//       setAllVideos(videos);
//       setAllResources(resources);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch resources');
//       setLoading(false);
//     }
//   };

//   // File helpers
//   const getFileIcon = (fileType, size = 'w-5 h-5') => {
//     const icons = {
//       'pdf': <FileText className={`${size} text-red-500`} />,
//       'doc': <FileText className={`${size} text-blue-600`} />,
//       'docx': <FileText className={`${size} text-blue-600`} />,
//       'xls': <FileSpreadsheet className={`${size} text-green-600`} />,
//       'xlsx': <FileSpreadsheet className={`${size} text-green-600`} />,
//       'jpg': <FileImage className={`${size} text-orange-500`} />,
//       'jpeg': <FileImage className={`${size} text-orange-500`} />,
//       'png': <FileImage className={`${size} text-orange-500`} />,
//       'mp3': <Music className={`${size} text-pink-500`} />,
//       'zip': <Archive className={`${size} text-gray-600`} />,
//       'rar': <Archive className={`${size} text-gray-600`} />,
//     };
//     return icons[fileType?.toLowerCase()] || <File className={`${size} text-gray-500`} />;
//   };

//   const getFileColor = (fileType) => {
//     const colors = {
//       'pdf': 'bg-red-50 border-red-200',
//       'doc': 'bg-blue-50 border-blue-200',
//       'docx': 'bg-blue-50 border-blue-200',
//       'xls': 'bg-green-50 border-green-200',
//       'xlsx': 'bg-green-50 border-green-200',
//       'jpg': 'bg-orange-50 border-orange-200',
//       'png': 'bg-orange-50 border-orange-200',
//       'zip': 'bg-gray-50 border-gray-200',
//     };
//     return colors[fileType?.toLowerCase()] || 'bg-gray-50 border-gray-200';
//   };

//   const formatFileSize = (bytes) => {
//     if (!bytes) return '';
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return '';
//     if (minutes < 60) return `${minutes} min`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
//   };

//   const handleDownload = async (resource) => {
//     setDownloadingId(resource.id);
//     try {
//       const response = await api.get(`/resources/download/${resource.id}`, {
//         responseType: 'blob'
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', resource.file_path?.split('/').pop() || `${resource.title}.${resource.file_type}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       if (resource.file_path) {
//         window.open(getFullUrl(resource.file_path), '_blank');
//       }
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   const handlePlayVideo = (video) => {
//     setSelectedVideo({
//       ...video,
//       url: getFullUrl(video.url)
//     });
//   };

//   const handleCloseVideo = () => {
//     if (videoRef.current) videoRef.current.pause();
//     setSelectedVideo(null);
//   };

//   // Filtered Data
//   const filteredVideos = useMemo(() => {
//     return allVideos.filter(video => {
//       const matchesSearch = !searchQuery || 
//         video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         video.courseName.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCourse = selectedCourseFilter === 'all' || video.courseId === selectedCourseFilter;
//       return matchesSearch && matchesCourse;
//     });
//   }, [allVideos, searchQuery, selectedCourseFilter]);

//   const filteredResources = useMemo(() => {
//     return allResources.filter(resource => {
//       const matchesSearch = !searchQuery || 
//         resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         resource.courseName.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCourse = selectedCourseFilter === 'all' || resource.courseId === selectedCourseFilter;
//       return matchesSearch && matchesCourse;
//     });
//   }, [allResources, searchQuery, selectedCourseFilter]);

//   // Stats
//   const stats = useMemo(() => ({
//     totalVideos: allVideos.length,
//     totalResources: allResources.length,
//     totalDuration: allVideos.reduce((acc, v) => acc + (v.duration || 0), 0),
//     courseCount: courses.length
//   }), [allVideos, allResources, courses]);

//   // ============================================
//   // LOADING STATE
//   // ============================================
//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
//         <div className="relative mb-4">
//           <div className="w-16 h-16 border-4 border-violet-200 rounded-full"></div>
//           <div className="w-16 h-16 border-4 border-violet-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
//         </div>
//         <p className="text-gray-600 font-medium">Loading your resources...</p>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR STATE
//   // ============================================
//   if (error) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
//         <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchAllResources}
//             className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // EMPTY STATE
//   // ============================================
//   if (allVideos.length === 0 && allResources.length === 0) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
//         <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-lg text-center">
//           <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <FolderOpen className="w-10 h-10 text-violet-600" />
//           </div>
//           <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">No Resources Yet</h3>
//           <p className="text-gray-600 mb-6">
//             Your enrolled courses don't have any resources available yet. Check back later!
//           </p>
//           <Link
//             to="/student/enrolled-courses"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition font-medium"
//           >
//             <GraduationCap className="w-5 h-5" />
//             View My Courses
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // MAIN RENDER
//   // ============================================
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
//       {/* Video Modal */}
//       {selectedVideo && (
//         <div
//           className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
//           onClick={handleCloseVideo}
//         >
//           <div
//             className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-5xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="bg-gray-800 text-white p-3 sm:p-4 flex justify-between items-start gap-3">
//               <div className="min-w-0 flex-1">
//                 <h3 className="font-bold text-base sm:text-lg truncate">{selectedVideo.title}</h3>
//                 <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
//                   <span className="truncate">{selectedVideo.courseName}</span>
//                   {selectedVideo.duration > 0 && (
//                     <>
//                       <span>•</span>
//                       <span className="flex items-center gap-1 whitespace-nowrap">
//                         <Clock className="w-3 h-3" />
//                         {formatDuration(selectedVideo.duration)}
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={handleCloseVideo}
//                 className="p-2 hover:bg-gray-700 rounded-lg transition flex-shrink-0"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Video */}
//             <div className="bg-black">
//               <video
//                 ref={videoRef}
//                 className="w-full max-h-[70vh]"
//                 controls
//                 autoPlay
//                 playsInline
//                 src={selectedVideo.url}
//               />
//             </div>

//             {/* Mobile external link */}
//             <div className="p-3 bg-gray-800 sm:hidden">
//               <a
//                 href={selectedVideo.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center justify-center gap-2 text-violet-400 text-sm font-medium"
//               >
//                 <ExternalLink className="w-4 h-4" />
//                 Open in full screen
//               </a>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============================================
//           PAGE HEADER
//       ============================================ */}
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
//           <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />
//           My Resources
//         </h1>
//         <p className="text-gray-600 mt-1 text-sm sm:text-base">
//           All your course videos and downloadable materials in one place
//         </p>
//       </div>

//       {/* ============================================
//           STATS CARDS
//       ============================================ */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
//         <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white/80 text-xs sm:text-sm">Videos</p>
//               <p className="text-2xl sm:text-3xl font-bold">{stats.totalVideos}</p>
//             </div>
//             <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white/80 text-xs sm:text-sm">Documents</p>
//               <p className="text-2xl sm:text-3xl font-bold">{stats.totalResources}</p>
//             </div>
//             <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white/80 text-xs sm:text-sm">Watch Time</p>
//               <p className="text-2xl sm:text-3xl font-bold">{formatDuration(stats.totalDuration) || '0'}</p>
//             </div>
//             <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white/80 text-xs sm:text-sm">Courses</p>
//               <p className="text-2xl sm:text-3xl font-bold">{stats.courseCount}</p>
//             </div>
//             <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
//           </div>
//         </div>
//       </div>

//       {/* ============================================
//           TABS & FILTERS
//       ============================================ */}
//       <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 mb-6">
//         {/* Tabs */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('all')}
//             className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition border-b-2 -mb-px ${
//               activeTab === 'all'
//                 ? 'text-violet-600 border-violet-600 bg-violet-50/50'
//                 : 'text-gray-500 border-transparent hover:text-gray-700'
//             }`}
//           >
//             <span className="flex items-center justify-center gap-2">
//               <Layers className="w-4 h-4" />
//               All
//               <span className="hidden sm:inline px-2 py-0.5 bg-gray-100 rounded-full text-xs">
//                 {allVideos.length + allResources.length}
//               </span>
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab('videos')}
//             className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition border-b-2 -mb-px ${
//               activeTab === 'videos'
//                 ? 'text-violet-600 border-violet-600 bg-violet-50/50'
//                 : 'text-gray-500 border-transparent hover:text-gray-700'
//             }`}
//           >
//             <span className="flex items-center justify-center gap-2">
//               <Video className="w-4 h-4" />
//               Videos
//               <span className="hidden sm:inline px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
//                 {allVideos.length}
//               </span>
//             </span>
//           </button>
//           <button
//             onClick={() => setActiveTab('documents')}
//             className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition border-b-2 -mb-px ${
//               activeTab === 'documents'
//                 ? 'text-violet-600 border-violet-600 bg-violet-50/50'
//                 : 'text-gray-500 border-transparent hover:text-gray-700'
//             }`}
//           >
//             <span className="flex items-center justify-center gap-2">
//               <FileText className="w-4 h-4" />
//               Documents
//               <span className="hidden sm:inline px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
//                 {allResources.length}
//               </span>
//             </span>
//           </button>
//         </div>

//         {/* Search & Filters */}
//         <div className="p-4 flex flex-col sm:flex-row gap-3">
//           {/* Search */}
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search resources..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
//             />
//           </div>

//           {/* Course Filter */}
//           <div className="relative">
//             <select
//               value={selectedCourseFilter}
//               onChange={(e) => setSelectedCourseFilter(e.target.value)}
//               className="appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
//             >
//               <option value="all">All Courses</option>
//               {courses.map(course => (
//                 <option key={course.id} value={course.id}>{course.title}</option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           </div>

//           {/* View Toggle */}
//           <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`p-2 rounded-lg transition ${
//                 viewMode === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-500'
//               }`}
//             >
//               <Grid3X3 className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded-lg transition ${
//                 viewMode === 'list' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-500'
//               }`}
//             >
//               <LayoutList className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ============================================
//           CONTENT DISPLAY
//       ============================================ */}
      
//       {/* Videos Section */}
//       {(activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
//         <div className="mb-8">
//           {activeTab === 'all' && (
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Video className="w-5 h-5 text-purple-600" />
//                 Videos
//                 <span className="text-sm font-normal text-gray-500">({filteredVideos.length})</span>
//               </h2>
//             </div>
//           )}

//           <div className={viewMode === 'grid' 
//             ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
//             : 'space-y-3'
//           }>
//             {filteredVideos.map(video => (
//               <VideoCard
//                 key={video.id}
//                 video={video}
//                 viewMode={viewMode}
//                 onPlay={() => handlePlayVideo(video)}
//                 formatDuration={formatDuration}
//                 getFullUrl={getFullUrl}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Documents Section */}
//       {(activeTab === 'all' || activeTab === 'documents') && filteredResources.length > 0 && (
//         <div className="mb-8">
//           {activeTab === 'all' && (
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-orange-500" />
//                 Documents
//                 <span className="text-sm font-normal text-gray-500">({filteredResources.length})</span>
//               </h2>
//             </div>
//           )}

//           <div className={viewMode === 'grid' 
//             ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
//             : 'space-y-3'
//           }>
//             {filteredResources.map(resource => (
//               <ResourceCard
//                 key={resource.id}
//                 resource={resource}
//                 viewMode={viewMode}
//                 onDownload={() => handleDownload(resource)}
//                 isDownloading={downloadingId === resource.id}
//                 getFileIcon={getFileIcon}
//                 getFileColor={getFileColor}
//                 formatFileSize={formatFileSize}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Empty State for Filters */}
//       {((activeTab === 'videos' && filteredVideos.length === 0) ||
//         (activeTab === 'documents' && filteredResources.length === 0) ||
//         (activeTab === 'all' && filteredVideos.length === 0 && filteredResources.length === 0)) && (
//         <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
//           <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
//           <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
//           <button
//             onClick={() => { setSearchQuery(''); setSelectedCourseFilter('all'); }}
//             className="mt-4 text-violet-600 font-medium text-sm hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       )}

//       {/* ============================================
//           HELP SECTION
//       ============================================ */}
//       <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h3 className="font-bold text-lg mb-1">Need Help?</h3>
//             <p className="text-gray-400 text-sm">Having trouble accessing your resources?</p>
//           </div>
//           <div className="flex flex-wrap gap-2 sm:gap-3">
//             <a
//               href={`tel:${CONTACT_INFO.phone}`}
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
//             >
//               <Phone className="w-4 h-4" />
//               {CONTACT_INFO.phone}
//             </a>
//             <a
//               href={`mailto:${CONTACT_INFO.email}`}
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium text-sm"
//             >
//               <Mail className="w-4 h-4" />
//               Email Support
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // VIDEO CARD COMPONENT
// // ============================================
// function VideoCard({ video, viewMode, onPlay, formatDuration, getFullUrl }) {
//   if (viewMode === 'list') {
//     return (
//       <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition flex items-center gap-4">
//         {/* Thumbnail */}
//         <button
//           onClick={onPlay}
//           className="relative w-24 h-16 sm:w-32 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group"
//         >
//           {video.thumbnail ? (
//             <img
//               src={getFullUrl(video.thumbnail)}
//               alt=""
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-600" />
//           )}
//           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//             <Play className="w-8 h-8 text-white" fill="white" />
//           </div>
//           {video.duration > 0 && (
//             <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
//               {formatDuration(video.duration)}
//             </span>
//           )}
//         </button>

//         {/* Info */}
//         <div className="flex-1 min-w-0">
//           <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{video.title}</h3>
//           <p className="text-gray-500 text-xs sm:text-sm mt-0.5 line-clamp-1">{video.courseName}</p>
//           <p className="text-gray-400 text-xs mt-1">{video.moduleName}</p>
//         </div>

//         {/* Play Button */}
//         <button
//           onClick={onPlay}
//           className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm flex-shrink-0"
//         >
//           <Play className="w-4 h-4" fill="white" />
//           Play
//         </button>
//       </div>
//     );
//   }

//   // Grid View
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group">
//       {/* Thumbnail */}
//       <button
//         onClick={onPlay}
//         className="relative w-full aspect-video bg-gray-100 overflow-hidden"
//       >
//         {video.thumbnail ? (
//           <img
//             src={getFullUrl(video.thumbnail)}
//             alt=""
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-600" />
//         )}
        
//         {/* Play Overlay */}
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//           <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
//             <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
//           </div>
//         </div>

//         {/* Duration Badge */}
//         {video.duration > 0 && (
//           <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md font-medium">
//             {formatDuration(video.duration)}
//           </span>
//         )}
//       </button>

//       {/* Info */}
//       <div className="p-4">
//         <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{video.title}</h3>
//         <p className="text-gray-500 text-xs line-clamp-1">{video.courseName}</p>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // RESOURCE CARD COMPONENT
// // ============================================
// function ResourceCard({ resource, viewMode, onDownload, isDownloading, getFileIcon, getFileColor, formatFileSize }) {
//   if (viewMode === 'list') {
//     return (
//       <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition flex items-center gap-4 ${getFileColor(resource.file_type)}`}>
//         {/* Icon */}
//         <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 border">
//           {getFileIcon(resource.file_type, 'w-6 h-6')}
//         </div>

//         {/* Info */}
//         <div className="flex-1 min-w-0">
//           <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{resource.title}</h3>
//           <p className="text-gray-500 text-xs sm:text-sm mt-0.5 line-clamp-1">{resource.courseName}</p>
//           <div className="flex items-center gap-2 mt-1">
//             <span className="uppercase text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
//               {resource.file_type}
//             </span>
//             {resource.file_size && (
//               <span className="text-xs text-gray-400">{formatFileSize(resource.file_size)}</span>
//             )}
//           </div>
//         </div>

//         {/* Download Button */}
//         <button
//           onClick={onDownload}
//           disabled={isDownloading}
//           className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 transition font-medium text-sm flex-shrink-0"
//         >
//           {isDownloading ? (
//             <Loader2 className="w-4 h-4 animate-spin" />
//           ) : (
//             <Download className="w-4 h-4" />
//           )}
//           <span className="hidden sm:inline">Download</span>
//         </button>
//       </div>
//     );
//   }

//   // Grid View
//   return (
//     <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition ${getFileColor(resource.file_type)}`}>
//       {/* Header with Icon */}
//       <div className="p-4 sm:p-5 flex items-start gap-3">
//         <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border flex-shrink-0">
//           {getFileIcon(resource.file_type, 'w-6 h-6')}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{resource.title}</h3>
//           <p className="text-gray-500 text-xs mt-1 line-clamp-1">{resource.courseName}</p>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span className="uppercase text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
//             {resource.file_type}
//           </span>
//           {resource.file_size && (
//             <span className="text-xs text-gray-400">{formatFileSize(resource.file_size)}</span>
//           )}
//         </div>
//         <button
//           onClick={onDownload}
//           disabled={isDownloading}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 transition text-sm font-medium"
//         >
//           {isDownloading ? (
//             <Loader2 className="w-4 h-4 animate-spin" />
//           ) : (
//             <Download className="w-4 h-4" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// components/StudentResources.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Video,
  Download,
  BookOpen,
  File,
  Clock,
  FileImage,
  FileSpreadsheet,
  Music,
  Archive,
  AlertCircle,
  Play,
  Layers,
  GraduationCap,
  X,
  Loader2,
  ExternalLink,
  Search,
  FolderOpen,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  LayoutList,
  Folder,
  BookMarked,
  Filter,
  PlayCircle
} from 'lucide-react';
import api from '../utils/api';

const BASE_URL = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads';

const CONTACT_INFO = {
  phone: "9700187077",
  email: "support@aimtutor.in"
};

export default function StudentResources() {
  // Data State
  const [coursesWithResources, setCoursesWithResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedModules, setExpandedModules] = useState({});

  const videoRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    fetchAllResources();
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedVideo) {
        handleCloseVideo();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedVideo]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (videoRef.current) videoRef.current.pause();
    };
  }, []);

  const getFullUrl = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  }, []);

  const fetchAllResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/users/get-dashboard');
      const coursesData = response.data.recent_activity || [];
      const enrolled = coursesData.filter(course => course.enrollment);

      if (enrolled.length === 0) {
        setLoading(false);
        return;
      }

      const coursePromises = enrolled.map(course =>
        api.post(`/api/v1/courses/get-courses/${course.id}?lessons=True&resources=True`)
          .then(res => res.data.course)
          .catch(() => null)
      );

      const coursesWithData = (await Promise.all(coursePromises)).filter(Boolean);
      setCoursesWithResources(coursesWithData);

      // Expand first module of first course by default
      if (coursesWithData.length > 0 && coursesWithData[0].modules?.length > 0) {
        setExpandedModules({
          [`${coursesWithData[0].id}-${coursesWithData[0].modules[0].id}`]: true
        });
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
      setLoading(false);
    }
  };

  // File helpers
  const getFileIcon = (fileType, size = 'w-5 h-5') => {
    const icons = {
      'pdf': <FileText className={`${size} text-red-500`} />,
      'doc': <FileText className={`${size} text-blue-600`} />,
      'docx': <FileText className={`${size} text-blue-600`} />,
      'xls': <FileSpreadsheet className={`${size} text-green-600`} />,
      'xlsx': <FileSpreadsheet className={`${size} text-green-600`} />,
      'jpg': <FileImage className={`${size} text-orange-500`} />,
      'jpeg': <FileImage className={`${size} text-orange-500`} />,
      'png': <FileImage className={`${size} text-orange-500`} />,
      'mp3': <Music className={`${size} text-pink-500`} />,
      'zip': <Archive className={`${size} text-gray-600`} />,
      'rar': <Archive className={`${size} text-gray-600`} />,
    };
    return icons[fileType?.toLowerCase()] || <File className={`${size} text-gray-500`} />;
  };

  const getFileColor = (fileType) => {
    const colors = {
      'pdf': 'bg-red-50 border-red-200 hover:border-red-300',
      'doc': 'bg-blue-50 border-blue-200 hover:border-blue-300',
      'docx': 'bg-blue-50 border-blue-200 hover:border-blue-300',
      'xls': 'bg-green-50 border-green-200 hover:border-green-300',
      'xlsx': 'bg-green-50 border-green-200 hover:border-green-300',
      'jpg': 'bg-orange-50 border-orange-200 hover:border-orange-300',
      'png': 'bg-orange-50 border-orange-200 hover:border-orange-300',
      'zip': 'bg-gray-50 border-gray-200 hover:border-gray-300',
    };
    return colors[fileType?.toLowerCase()] || 'bg-gray-50 border-gray-200 hover:border-gray-300';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleDownload = async (resource) => {
    setDownloadingId(resource.id);
    try {
      const response = await api.get(`/resources/download/${resource.id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.file_path?.split('/').pop() || `${resource.title}.${resource.file_type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (resource.file_path) {
        window.open(getFullUrl(resource.file_path), '_blank');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePlayVideo = (video) => {
    setSelectedVideo({
      ...video,
      url: getFullUrl(video.url)
    });
  };

  const handleCloseVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    setSelectedVideo(null);
  };

  const toggleModule = (courseId, moduleId) => {
    const key = `${courseId}-${moduleId}`;
    setExpandedModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const expandAllModules = (courseId) => {
    const course = coursesWithResources.find(c => c.id === courseId);
    if (!course) return;

    const newExpanded = { ...expandedModules };
    course.modules?.forEach(module => {
      newExpanded[`${courseId}-${module.id}`] = true;
    });
    setExpandedModules(newExpanded);
  };

  const collapseAllModules = (courseId) => {
    const course = coursesWithResources.find(c => c.id === courseId);
    if (!course) return;

    const newExpanded = { ...expandedModules };
    course.modules?.forEach(module => {
      newExpanded[`${courseId}-${module.id}`] = false;
    });
    setExpandedModules(newExpanded);
  };

  // Calculate stats
  const stats = useMemo(() => {
    let totalVideos = 0;
    let totalResources = 0;
    let totalDuration = 0;
    let totalModules = 0;

    coursesWithResources.forEach(course => {
      totalModules += course.modules?.length || 0;
      course.modules?.forEach(module => {
        module.lessons?.forEach(lesson => {
          if (lesson.video_url) {
            totalVideos++;
            totalDuration += lesson.duration_minutes || 0;
          }
          totalResources += lesson.resources?.length || 0;
        });
      });
    });

    return { totalVideos, totalResources, totalDuration, totalModules, courseCount: coursesWithResources.length };
  }, [coursesWithResources]);

  // Filter courses based on selection
  const filteredCourses = useMemo(() => {
    if (selectedCourseFilter === 'all') return coursesWithResources;
    return coursesWithResources.filter(c => c.id === selectedCourseFilter);
  }, [coursesWithResources, selectedCourseFilter]);

  // Search within modules
  const getFilteredModules = (course) => {
    if (!searchQuery) return course.modules || [];

    const query = searchQuery.toLowerCase();
    return (course.modules || []).filter(module => {
      // Check module title
      if (module.title?.toLowerCase().includes(query)) return true;

      // Check lessons
      return module.lessons?.some(lesson => {
        if (lesson.title?.toLowerCase().includes(query)) return true;
        return lesson.resources?.some(r => r.title?.toLowerCase().includes(query));
      });
    });
  };

  // Filter lessons based on active tab and search
  const getFilteredLessons = (lessons) => {
    if (!lessons) return [];

    let filtered = lessons;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson =>
        lesson.title?.toLowerCase().includes(query) ||
        lesson.resources?.some(r => r.title?.toLowerCase().includes(query))
      );
    }

    // Filter by tab
    if (activeTab === 'videos') {
      filtered = filtered.filter(lesson => lesson.video_url);
    } else if (activeTab === 'documents') {
      filtered = filtered.filter(lesson => lesson.resources?.length > 0);
    }

    return filtered;
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-violet-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-violet-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your resources...</p>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllResources}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // EMPTY STATE
  // ============================================
  if (coursesWithResources.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-lg text-center">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10 text-violet-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">No Resources Yet</h3>
          <p className="text-gray-600 mb-6">
            Your enrolled courses don't have any resources available yet. Check back later!
          </p>
          <Link
            to="/student/enrolled-courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition font-medium"
          >
            <GraduationCap className="w-5 h-5" />
            View My Courses
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={handleCloseVideo}
        >
          <div
            className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-800 text-white p-3 sm:p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base sm:text-lg truncate">{selectedVideo.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {selectedVideo.courseName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5" />
                      {selectedVideo.moduleName}
                    </span>
                    {selectedVideo.duration > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(selectedVideo.duration)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCloseVideo}
                  className="p-2 hover:bg-gray-700 rounded-lg transition flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video */}
            <div className="bg-black">
              <video
                ref={videoRef}
                className="w-full max-h-[70vh]"
                controls
                autoPlay
                playsInline
                src={selectedVideo.url}
              />
            </div>

            {/* Mobile external link */}
            <div className="p-3 bg-gray-800 sm:hidden">
              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-violet-400 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Open in full screen
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          PAGE HEADER
      ============================================ */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />
          My Resources
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          All your course videos and materials organized by modules
        </p>
      </div>

      {/* ============================================
          STATS CARDS
      ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          label="Courses"
          value={stats.courseCount}
          icon={<GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="from-violet-500 to-purple-600"
        />
        <StatCard
          label="Modules"
          value={stats.totalModules}
          icon={<Folder className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          label="Videos"
          value={stats.totalVideos}
          icon={<Video className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          label="Documents"
          value={stats.totalResources}
          icon={<FileText className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          label="Duration"
          value={formatDuration(stats.totalDuration) || '0m'}
          icon={<Clock className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="from-cyan-500 to-teal-600"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* ============================================
          FILTERS BAR
      ============================================ */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 mb-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'all', label: 'All', icon: Layers, count: stats.totalVideos + stats.totalResources },
            { id: 'videos', label: 'Videos', icon: Video, count: stats.totalVideos, color: 'purple' },
            { id: 'documents', label: 'Documents', icon: FileText, count: stats.totalResources, color: 'orange' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-violet-600 border-violet-600 bg-violet-50/50'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-xs ${
                  tab.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                  tab.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos, documents, or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Course Filter */}
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="appearance-none w-full sm:w-56 pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
            >
              <option value="all">All Courses</option>
              {coursesWithResources.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl self-start">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-500'}`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-500'}`}
              title="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          COURSES & MODULES CONTENT
      ============================================ */}
      <div className="space-y-6">
        {filteredCourses.map(course => {
          const modules = getFilteredModules(course);

          if (modules.length === 0) return null;

          return (
            <div key={course.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-4 sm:p-5 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg sm:text-xl">{course.title}</h2>
                      <p className="text-violet-200 text-sm">
                        {modules.length} module{modules.length !== 1 ? 's' : ''} • {course.instructor_name || 'Instructor'}
                      </p>
                    </div>
                  </div>

                  {/* Expand/Collapse All */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => expandAllModules(course.id)}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm font-medium transition"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={() => collapseAllModules(course.id)}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm font-medium transition"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>
              </div>

              {/* Modules */}
              <div className="divide-y divide-gray-100">
                {modules.map((module, moduleIndex) => {
                  const isExpanded = expandedModules[`${course.id}-${module.id}`];
                  const filteredLessons = getFilteredLessons(module.lessons);
                  const moduleVideos = filteredLessons.filter(l => l.video_url);
                  const moduleResources = filteredLessons.flatMap(l => l.resources || []);

                  // Skip module if no content matches the filter
                  if (activeTab === 'videos' && moduleVideos.length === 0) return null;
                  if (activeTab === 'documents' && moduleResources.length === 0) return null;

                  return (
                    <div key={module.id}>
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(course.id, module.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition text-left"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                            {module.order || moduleIndex + 1}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                              {module.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                              {moduleVideos.length > 0 && (
                                <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                  <Video className="w-3 h-3" />
                                  {moduleVideos.length} video{moduleVideos.length !== 1 ? 's' : ''}
                                </span>
                              )}
                              {moduleResources.length > 0 && (
                                <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                  <FileText className="w-3 h-3" />
                                  {moduleResources.length} file{moduleResources.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Module Content */}
                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                          {/* Videos Section */}
                          {(activeTab === 'all' || activeTab === 'videos') && moduleVideos.length > 0 && (
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <Video className="w-4 h-4 text-purple-600" />
                                Videos ({moduleVideos.length})
                              </h4>
                              <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                                : 'space-y-3'
                              }>
                                {moduleVideos.map((lesson, lessonIndex) => (
                                  <VideoCard
                                    key={lesson.id}
                                    video={{
                                      id: lesson.id,
                                      title: lesson.title,
                                      url: lesson.video_url,
                                      duration: lesson.duration_minutes,
                                      courseName: course.title,
                                      moduleName: module.title,
                                      lessonOrder: lesson.order || lessonIndex + 1,
                                      thumbnail: course.thumbnail
                                    }}
                                    viewMode={viewMode}
                                    onPlay={() => handlePlayVideo({
                                      id: lesson.id,
                                      title: lesson.title,
                                      url: lesson.video_url,
                                      duration: lesson.duration_minutes,
                                      courseName: course.title,
                                      moduleName: module.title,
                                      thumbnail: course.thumbnail
                                    })}
                                    formatDuration={formatDuration}
                                    getFullUrl={getFullUrl}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resources Section */}
                          {(activeTab === 'all' || activeTab === 'documents') && moduleResources.length > 0 && (
                            <div>
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                <FileText className="w-4 h-4 text-orange-500" />
                                Documents ({moduleResources.length})
                              </h4>
                              <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                                : 'space-y-3'
                              }>
                                {filteredLessons.map(lesson =>
                                  lesson.resources?.map(resource => (
                                    <ResourceCard
                                      key={resource.id}
                                      resource={{
                                        ...resource,
                                        lessonTitle: lesson.title,
                                        courseName: course.title,
                                        moduleName: module.title
                                      }}
                                      viewMode={viewMode}
                                      onDownload={() => handleDownload(resource)}
                                      isDownloading={downloadingId === resource.id}
                                      getFileIcon={getFileIcon}
                                      getFileColor={getFileColor}
                                      formatFileSize={formatFileSize}
                                    />
                                  ))
                                )}
                              </div>
                            </div>
                          )}

                          {/* No content message */}
                          {filteredLessons.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <FolderOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No content matches your search</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {filteredCourses.every(course => getFilteredModules(course).length === 0) && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCourseFilter('all'); setActiveTab('all'); }}
              className="text-violet-600 font-medium text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          HELP SECTION
      ============================================ */}
      <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Need Help?</h3>
            <p className="text-gray-400 text-sm">Having trouble accessing your resources?</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
            >
              <Phone className="w-4 h-4" />
              {CONTACT_INFO.phone}
            </a>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium text-sm"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({ label, value, icon, gradient, className = '' }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs sm:text-sm">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-0.5">{value}</p>
        </div>
        <div className="text-white/30">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================
// VIDEO CARD COMPONENT
// ============================================
function VideoCard({ video, viewMode, onPlay, formatDuration, getFullUrl }) {
  if (viewMode === 'list') {
    return (
      <div
        onClick={onPlay}
        className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md hover:border-purple-300 transition cursor-pointer flex items-center gap-3 sm:gap-4"
      >
        {/* Thumbnail */}
        <div className="relative w-20 h-14 sm:w-28 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group">
          {video.thumbnail ? (
            <img
              src={getFullUrl(video.thumbnail)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-600" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          {video.duration > 0 && (
            <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 text-white text-[10px] rounded">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{video.title}</h4>
          <p className="text-gray-500 text-xs mt-1">
            Lesson {video.lessonOrder}
            {video.duration > 0 && ` • ${formatDuration(video.duration)}`}
          </p>
        </div>

        {/* Play Icon */}
        <Play className="w-5 h-5 text-purple-600 flex-shrink-0 hidden sm:block" />
      </div>
    );
  }

  // Grid View
  return (
    <div
      onClick={onPlay}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {video.thumbnail ? (
          <img
            src={getFullUrl(video.thumbnail)}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-600" />
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition">
            <Play className="w-5 h-5 text-purple-600 ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration > 0 && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded font-medium">
            {formatDuration(video.duration)}
          </span>
        )}

        {/* Lesson Number */}
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600/90 text-white text-xs rounded font-medium">
          Lesson {video.lessonOrder}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{video.title}</h4>
      </div>
    </div>
  );
}

// ============================================
// RESOURCE CARD COMPONENT
// ============================================
function ResourceCard({ resource, viewMode, onDownload, isDownloading, getFileIcon, getFileColor, formatFileSize }) {
  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-xl border p-3 sm:p-4 hover:shadow-md transition flex items-center gap-3 sm:gap-4 ${getFileColor(resource.file_type)}`}>
        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border flex-shrink-0">
          {getFileIcon(resource.file_type, 'w-5 h-5 sm:w-6 sm:h-6')}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{resource.title}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="uppercase text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {resource.file_type}
            </span>
            {resource.file_size && (
              <span className="text-xs text-gray-400">{formatFileSize(resource.file_size)}</span>
            )}
            <span className="text-xs text-gray-400 truncate">• {resource.lessonTitle}</span>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 transition text-sm font-medium flex-shrink-0"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    );
  }

  // Grid View
  return (
    <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition ${getFileColor(resource.file_type)}`}>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border flex-shrink-0">
            {getFileIcon(resource.file_type, 'w-5 h-5')}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{resource.title}</h4>
            <p className="text-xs text-gray-400 mt-1 truncate">From: {resource.lessonTitle}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="uppercase text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
            {resource.file_type}
          </span>
          {resource.file_size && (
            <span className="text-xs text-gray-400">{formatFileSize(resource.file_size)}</span>
          )}
        </div>
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400 transition text-xs font-medium"
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}