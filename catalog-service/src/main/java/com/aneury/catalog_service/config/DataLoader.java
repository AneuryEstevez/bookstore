package com.aneury.catalog_service.config;

import com.aneury.catalog_service.model.Book;
import com.aneury.catalog_service.repository.BookRepository;
import lombok.AllArgsConstructor;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            Faker faker = new Faker();
            List<Book> books = new ArrayList<>();
            for (int i = 0; i < 100; i++) {
                Book book = new Book();
                book.setTitle(faker.book().title());
                book.setAuthor(faker.book().author());
                book.setGenre(faker.book().genre());
                book.setPublisher(faker.book().publisher());
                book.setPrice(faker.number().randomDouble(2, 5, 100));
                books.add(book);
            }
            bookRepository.saveAll(books);
        }
    }
}
