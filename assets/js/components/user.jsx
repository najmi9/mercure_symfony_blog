import React, { useCallback } from 'react';
import { new_conv_url, userImage } from '../urls';
import useFetch from '../hooks/useFetch';
import Loader from '../utils/loader';
import { toast } from 'react-toastify';

const User = React.memo(({ user }) => {
    const { loading, load } = useFetch();

    const handleClick = useCallback(async (e) => {
        e.preventDefault();
        const data = await load(new_conv_url(user.id), 'POST');
        if (!data.alreadyExists) {
            toast.success('💬 Conversation created!! you can chat now  with ' + user.name);
        }
    }, [user]);

    return (
        <>
            {loading && <Loader width= {70} strokeWidth={15} minHeight={20} /> }

            {!loading && <div className="user card rounder shadow-lg p-2 m-3" onClick={handleClick}>
                <div className="link-to-conv">
                    <div className="conv-header">
                        <img src={userImage(user.picture)} alt={user.name} className="rounded-circle"
                         width="40" height="40" />
                        <span className="font-weight-bolder text-success h6"> {user.name} </span>
                    </div>
                </div>
            </div>}
        </>
    );
});

export default User;