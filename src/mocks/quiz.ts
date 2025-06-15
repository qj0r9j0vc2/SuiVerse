export type QuizQuestion = {
    id: string;
    type: 'multiple' | 'short';
    question: string;
    options?: string[];
    answer: string | number;
  };
  
  export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {

    await new Promise((r) => setTimeout(r, 400));
    return [
      {
        id: '1',
        type: 'multiple',
        question: 'What is the name of consens of sui?',
        options: ['Narwhal & Bullshark', 'HotStuff', 'Tendermint', 'Raft'],
        answer: 0,
      },
      {
        id: '2',
        type: 'short',
        question: 'What is the basic coin of sui?',
        answer: 'SUI',
      },

    ];
  }
  