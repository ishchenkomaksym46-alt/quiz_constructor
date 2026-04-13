import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/quizzes/leaderboard?limit=20`
                );

                if (res.data.success) {
                    setLeaderboard(res.data.leaderboard);
                } else {
                    setError(res.data.message);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to load leaderboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div>Loading leaderboard...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Quiz Leaderboard</h1>
            <p>Top quizzes by likes</p>

            {leaderboard.length === 0 ? (
                <p>No quizzes yet</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rank</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quiz Title</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Creator</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Likes</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((quiz, index) => (
                            <tr key={quiz.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    {index + 1}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {quiz.title}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {quiz.creator_email}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    {quiz.likes_count}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <a href={`/quizzes/start?id=${quiz.id}`}>Start Quiz</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '20px' }}>
                <a href="/">Back to Home</a>
            </div>
        </div>
    );
}
