import React from 'react'

const reaction = () => {


    const handleAddReaction = (emojiData, messageId) => {
        socket.emit('addReaction', {
            messageId,
            emoji: emojiData.emoji,
            userId: currentUserId,
        });
        setReactingToMessageId(null);
    };

    useEffect(() => {
        const handleReactionAdded = (reactionData) => {
            const { messageId, emoji, userId } = reactionData;
            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    if ((msg.id || msg.tempId) === messageId) {
                        const newReactions = { ...(msg.reactions || {}) };
                        if (!newReactions[emoji]) {
                            newReactions[emoji] = [];
                        }
                        if (!newReactions[emoji].includes(String(userId))) {
                            newReactions[emoji].push(String(userId));
                        }
                        return { ...msg, reactions: newReactions };
                    }
                    return msg;
                })
            );
        };

        const handleReactionRemoved = (reactionData) => {
            const { messageId, emoji, userId } = reactionData;
            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    if ((msg.id || msg.tempId) === messageId) {
                        const newReactions = { ...(msg.reactions || {}) };
                        if (newReactions[emoji]) {
                            newReactions[emoji] = newReactions[emoji].filter(id => String(id) !== String(userId));
                            if (newReactions[emoji].length === 0) {
                                delete newReactions[emoji];
                            }
                        }
                        return { ...msg, reactions: newReactions };
                    }
                    return msg;
                })
            );
        };

        socket.on('reactionAdded', handleReactionAdded);
        socket.on('reactionRemoved', handleReactionRemoved);

        return () => {
            socket.off('reactionAdded', handleReactionAdded);
            socket.off('reactionRemoved', handleReactionRemoved);
        };
    }, [setMessages]);
    return (
        <div>
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className={`reactions-display ${isSent ? 'sent-reactions' : 'received-reactions'}`}>
                    {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                        <span key={emoji} className="reaction-chip">
                            {emoji} {userIds.length > 1 ? userIds.length : ''}
                        </span>
                    ))}
                </div>
            )}
            {reactingToMessageId === messageId && (
                <div className="reaction-picker-container">
                    <Picker
                        onEmojiClick={(emojiData) => handleAddReaction(emojiData, messageId)}
                        searchDisabled={true}
                        previewConfig={{ showPreview: false }}
                        height={240}
                        width={280}
                    />
                </div>
            )}
        </div>
    )
}

export default reaction
