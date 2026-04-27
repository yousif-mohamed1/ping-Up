package com.pingup.config;

import com.pingup.entity.Follow;
import com.pingup.entity.Message;
import com.pingup.entity.Post;
import com.pingup.entity.PostLike;
import com.pingup.entity.Story;
import com.pingup.entity.User;
import com.pingup.repository.FollowRepository;
import com.pingup.repository.MessageRepository;
import com.pingup.repository.PostLikeRepository;
import com.pingup.repository.PostRepository;
import com.pingup.repository.StoryRepository;
import com.pingup.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            PostRepository postRepository,
            StoryRepository storyRepository,
            MessageRepository messageRepository,
            FollowRepository followRepository,
            PostLikeRepository likeRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User john = user("admin@example.com", "john_warren", "John Warren", passwordEncoder);
            john.setBio("Dreamer | Learner | Doer\nExploring life one step at a time.\nStaying curious. Creating with purpose.");
            john.setProfilePicture("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200");
            john.setCoverPhoto("https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg");
            john.setLocation("New York, NY");
            john.setVerified(true);
            userRepository.save(john);

            User richard = user("richard@example.com", "richard_hendricks", "Richard Hendricks", passwordEncoder);
            richard.setProfilePicture("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200");
            richard.setBio("Founder, builder, and distributed systems nerd.");
            richard.setLocation("Palo Alto, CA");
            userRepository.save(richard);

            User alexa = user("alexa@example.com", "alexa_james", "Alexa James", passwordEncoder);
            alexa.setProfilePicture("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop");
            alexa.setBio("Designer, storyteller, and coffee-powered creator.");
            alexa.setLocation("Boston, MA");
            userRepository.save(alexa);

            follow(followRepository, richard, john);
            follow(followRepository, alexa, john);
            follow(followRepository, john, richard);
            follow(followRepository, john, alexa);

            Post p1 = postRepository.save(post(john, "We're a small #team with a big vision, working day and night to turn dreams into products people love.", "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"));
            Post p2 = postRepository.save(post(john, "Unlock your potential. Every small step counts. #Motivation #GrowthMindset", null));
            Post p3 = postRepository.save(post(richard, "Finally got the car!", "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"));

            like(likeRepository, p1, richard);
            like(likeRepository, p3, john);

            storyRepository.save(story(john, "Something interesting is in motion. Stay tuned.", "", "text"));
            storyRepository.save(story(richard, "", "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg", "image"));
            storyRepository.save(story(alexa, "", "https://videos.pexels.com/video-files/14447442/14447442-hd_1080_1920_30fps.mp4", "video"));

            messageRepository.save(message(richard, john, "I saw your profile", "", "text"));
            messageRepository.save(message(john, richard, "Thanks! Great to connect.", "", "text"));
            messageRepository.save(message(alexa, john, "How are you?", "", "text"));
        };
    }

    private User user(String email, String username, String fullName, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setFullName(fullName);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setBio("");
        user.setProfilePicture("");
        user.setCoverPhoto("");
        return user;
    }

    private Post post(User user, String content, String imageUrl) {
        Post post = new Post();
        post.setUser(user);
        post.setContent(content);
        post.setImageUrls(imageUrl == null ? Collections.<String>emptyList() : Arrays.asList(imageUrl));
        post.setVideoUrl("");
        post.setPostType(imageUrl == null ? "text" : "text_with_image");
        return post;
    }

    private Story story(User user, String content, String mediaUrl, String mediaType) {
        Story story = new Story();
        story.setUser(user);
        story.setContent(content);
        story.setMediaUrl(mediaUrl);
        story.setMediaType(mediaType);
        story.setBackgroundColor("#4f46e5");
        return story;
    }

    private Message message(User sender, User receiver, String text, String mediaUrl, String messageType) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setText(text);
        message.setMediaUrl(mediaUrl);
        message.setMessageType(messageType);
        message.setSeen(false);
        return message;
    }

    private void follow(FollowRepository repository, User follower, User following) {
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        follow.setStatus("ACCEPTED");
        repository.save(follow);
    }

    private void like(PostLikeRepository repository, Post post, User user) {
        PostLike like = new PostLike();
        like.setPost(post);
        like.setUser(user);
        repository.save(like);
    }
}
