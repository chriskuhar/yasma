### YASMA, Yet Another Social Mail App

Work in progress, at this point the user can log in, get gmail OAuth2 token,read messages and send email.


Here is the difference, **YOU** own the data.

The concept is, this app is a mail reader with a feature to view only posts.  A
Post is an email CC'd to a user created group of friends with a special tag so the
reader knows to isolate posts.  In the reader mode a user is able to scroll through posts
and create posts and replys.  Replys will be another MIME part in the message. The tag in the message
is a unique identifier which helps aggregate messages and are contained in an X-Header which will
be used to consolidate messages to one post and a list of replies. 

This is a work in progress and development of the mail reader is currently in development.

There are two directories, 

* yasma: NestJS API, React for auth state management
* yasma-client: React / Next.js email reading client (at this point)
