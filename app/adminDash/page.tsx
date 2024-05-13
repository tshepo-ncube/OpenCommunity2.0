"use client";
import React, { useState } from 'react';

interface Option {
    id: number;
    value: string;
}

interface Poll {
    pollName: string;
    options: Option[];
}

interface EventDetails {
    eventName: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
}

const AdminDash: React.FC = () => {
    const [pollName, setPollName] = useState<string>('');
    const [options, setOptions] = useState<Option[]>([
        { id: 1, value: '' },
        { id: 2, value: '' }
    ]);
    const [polls, setPolls] = useState<Poll[]>([]); // Store array of polls
    const [showPollForm, setShowPollForm] = useState<boolean>(false); // Control visibility of the poll form

    // Functions for handling polls
    const handlePollNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPollName(event.target.value);
    };

    const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newOptions = options.map((option, i) => {
            if (i === index) {
                return { ...option, value: event.target.value };
            }
            return option;
        });
        setOptions(newOptions);
    };

    const addOption = () => {
        const newOptionId = options.length + 1;
        const newOption = { id: newOptionId, value: '' };
        setOptions([...options, newOption]);
    };

    const handleSubmitPoll = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPolls([...polls, { pollName, options }]);
        setPollName('');
        setOptions([{ id: 1, value: '' }, { id: 2, value: '' }]);
        setShowPollForm(false);
    };

    const handleCreateNewPoll = () => {
        setShowPollForm(true);
    };

    const handleDeletePoll = (index: number) => {
        setPolls(currentPolls => currentPolls.filter((_, idx) => idx !== index));
    };

    // Functions for handling events
    const [eventDetails, setEventDetails] = useState<EventDetails>({
        eventName: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: ''
    });
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [showEventForm, setShowEventForm] = useState<boolean>(true);

    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEventDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmitEvent = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEvents(prevEvents => [...prevEvents, eventDetails]);
        setEventDetails({ eventName: '', date: '', startTime: '', endTime: '', location: '', description: '' });
        setShowEventForm(false);
    };

    const handleCreateNewEvent = () => {
        setShowEventForm(true);
    };

    const handleDeleteEvent = (index: number) => {
        setEvents(currentEvents => currentEvents.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex justify-between w-full mb-4">
                <div className="w-1/2 mr-2">
                    <button onClick={handleCreateNewEvent} className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                        Post Event
                    </button>
                    {showEventForm && (
                        <form onSubmit={handleSubmitEvent} className="p-4 border-2 border-gray-300 rounded-lg shadow-lg max-w-md w-full mt-4">
                            <h1 className="text-xl font-bold mb-4">Create Event</h1>
                            <div className="mb-4">
                                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                                <input
                                    type="text"
                                    name="eventName"
                                    id="eventName"
                                    value={eventDetails.eventName}
                                    onChange={handleChangeEvent}
                                    placeholder="Enter event name"
                                    className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={eventDetails.date}
                                    onChange={handleChangeEvent}
                                    className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex justify-between gap-3">
                                <div className="flex-1">
                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        id="startTime"
                                        value={eventDetails.startTime}
                                        onChange={handleChangeEvent}
                                        className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        id="endTime"
                                        value={eventDetails.endTime}
                                        onChange={handleChangeEvent}
                                        className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    value={eventDetails.location}
                                    onChange={handleChangeEvent}
                                    placeholder="Enter location"
                                    className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={eventDetails.description}
                                    onChange={handleChangeEvent}
                                    placeholder="Enter event description"
                                    className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                                Submit Event
                            </button>
                        </form>
                    )}
                </div>
                <div className="w-1/2 ml-2">
                    <button onClick={handleCreateNewPoll} className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
                        Post Poll
                    </button>
                    {showPollForm && (
                        <form onSubmit={handleSubmitPoll} className="p-4 border-2 border-gray-300 rounded-lg shadow-lg max-w-md w-full mt-4">
                            <h1 className="text-xl font-bold mb-4">Create Poll</h1>
                            <div className="mb-4">
                                <label htmlFor="pollName" className="block text-sm font-medium text-gray-700">Question</label>
                                <input
                                    type="text"
                                    name="pollName"
                                    id="pollName"
                                    value={pollName}
                                    onChange={handlePollNameChange}
                                    placeholder="Ask question"
                                    className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            {options.map((option, index) => (
                                <div key={option.id} className="mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Option ${option.id}`}
                                        value={option.value}
                                        onChange={(event) => handleOptionChange(index, event)}
                                        className="mt-1 block w-full rounded-md border-2 border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                </div>
                            ))}
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Option
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                                >
                                    Submit Poll
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center mt-4">
                {events.map((event, index) => (
                    <div key={index} className="p-4 border-2 border-gray-300 rounded-lg shadow-lg m-2" style={{ width: 'calc(33% - 1rem)' }}>
                        <h2 className="text-xl font-bold">Event Details</h2>
                        <p><strong>Name:</strong> {event.eventName}</p>
                        <p><strong>Date:</strong> {event.date.split('-').reverse().join('/')}</p>
                        <p><strong>Start Time:</strong> {event.startTime}</p>
                        <p><strong>End Time:</strong> {event.endTime}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Description:</strong> {event.description}</p>
                        <button className="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">Edit</button>
                        <button onClick={() => handleDeleteEvent(index)} className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-700 text-white font-bold rounded">Cancel Event</button>
                    </div>
                ))}
            </div>
            <div className="w-full flex flex-wrap justify-center mt-4">
                {polls.map((poll, index) => (
                    <div key={index} className="p-4 border-2 border-gray-300 rounded-lg shadow-lg m-2" style={{ width: 'calc(33% - 1rem)' }}>
                        <h2 className="text-xl font-bold">{poll.pollName}</h2>
                        <ul>
                            {poll.options.map((option, idx) => (
                                <li key={idx}>{option.value}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleDeletePoll(index)} className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDash;
